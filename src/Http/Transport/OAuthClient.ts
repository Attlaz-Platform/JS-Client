import {JsonSerializable} from '../../Model/JsonSerializable.js';
import {VERSION} from '../../version.js';
import {ClientError} from '../ClientError.js';
import {HttpStatus} from '../HttpStatus.js';
import {Headers} from '../Data/Headers.js';
import {Parameters} from '../Data/Parameters.js';
import {HttpClient} from '../HttpClient.js';
import {HttpClientRequest} from '../HttpClientRequest.js';
import {HttpClientResponse} from '../HttpClientResponse.js';
import {OAuthClientOptions} from '../OAuthClientOptions.js';
import {OAuthClientToken} from '../OAuthClientToken.js';
import {ITransport, ParseErrorHandler} from './ITransport.js';

/**
 * Invoked whenever the client changes the token by itself: after a successful authenticate or
 * refresh (the server rotates refresh tokens, so the previous one is revoked at that moment), and
 * with null when a refresh is rejected and the session is gone. A consumer that persists the token
 * must listen here — reading getToken() after a call is too late, because a rotated token that is
 * never written back is replayed later and rejected. Not invoked for setToken()/unsetToken(), which
 * are the caller's own writes.
 */
export type TokenChangeHandler = (token: OAuthClientToken | null) => void;

export class OAuthClient implements ITransport {
    private debug: boolean = false;

    private oauthClientToken: OAuthClientToken | null = null;
    private tokenChangeHandler: TokenChangeHandler | null = null;
    // Single-flight guard for token acquisition (initial client-credentials auth or refresh), so
    // concurrent requests share one in-flight acquisition instead of each hitting the token endpoint.
    private tokenAcquisitionPromise: Promise<void> | null = null;

    private version: string | null = null;

    private parseErrorHandler: ParseErrorHandler | null = null;

    constructor(private readonly options: OAuthClientOptions) {
        this.initDefaultHeaders();
    }

    public async authenticate(username: string, password: string): Promise<boolean>;

    public async authenticate(): Promise<boolean>;

    public async authenticate(username: string | null = null, password: string | null = null): Promise<boolean> {
        // TODO: should we encrypt the password in the client (or is https save enough)?
        try {
            if (username !== null && username !== undefined && password !== null && password !== undefined) {
                // Password flow / Owner Credentials grant
                const params: Record<string, string | null> = {
                    grant_type: 'password',
                    client_id: this.options.clientId,
                    username,
                    password,
                    scope: this.options.scopes.join(' '),
                };
                if (!this.isPublicClient()) {
                    params.client_secret = this.options.clientSecret;
                }
                const rawAuthToken = await this.requestToken(params);
                this.applyToken(this.tokenToOauthClientToken(rawAuthToken));

                return true;
            }

            if (this.options.clientId !== null && this.options.clientSecret !== null) {
                // Client credentials flow (only for confidential clients)
                const rawAuthToken = await this.requestToken({
                    grant_type: 'client_credentials',
                    client_id: this.options.clientId,
                    client_secret: this.options.clientSecret,
                    scope: this.options.scopes.join(' '),
                });
                this.applyToken(this.tokenToOauthClientToken(rawAuthToken));
            }
            return true;
        } catch (requestError: unknown) {
            if (this.debug) {
                console.debug('[Client] Error during authentication', requestError);
            }
            throw ClientError.fromError(requestError as Error);
        }
    }

    public async refreshToken(): Promise<void> {
        if (this.debug) {
            console.debug('[OAuthClient] refresh token');
        }
        if (this.oauthClientToken === null) {
            throw new Error('unable to refresh token, auth token not set');
        }
        if (this.oauthClientToken.refresh_token === undefined || this.oauthClientToken.refresh_token === null || this.oauthClientToken.refresh_token === '') {
            throw new Error('unable to refresh token, refresh token not set');
        }

        try {
            const params: Record<string, string | null> = {
                grant_type: 'refresh_token',
                client_id: this.options.clientId,
                refresh_token: this.oauthClientToken.refresh_token,
                scope: this.options.scopes.join(' '),
            };
            if (!this.isPublicClient()) {
                params.client_secret = this.options.clientSecret;
            }
            const rawAuthToken = await this.requestToken(params);
            this.applyToken(this.tokenToOauthClientToken(rawAuthToken));
        } catch (e: unknown) {
            if (e instanceof ClientError) {
                // A refresh grant rejected by the server (4xx — the refresh token is
                // expired/revoked/invalid_grant) means the session is irrecoverable and
                // the user must re-authenticate. Surface it as 401 Unauthorized so
                // consumers sign out and redirect to login instead of showing a generic
                // error. Transient failures (network / 5xx) are rethrown unchanged so a
                // hiccup doesn't force a logout.
                if (e.httpStatus !== null && e.httpStatus >= 400 && e.httpStatus < 500) {
                    // Drop the rejected token: keeping it means every later request retries the
                    // same dead refresh token, and the server's firewall blocks the IP after a
                    // handful of those. A confidential client re-mints via client_credentials on
                    // the next request; a public one now fails fast with 401 instead of looping.
                    this.applyToken(null);
                    throw new ClientError('Refresh token rejected, re-authentication required', HttpStatus.HTTP_UNAUTHORIZED);
                }
                throw e;
            }
            throw ClientError.fromError(e as Error);
        }
    }

    /**
     * Update the client credentials in place — without recreating the client or touching the current
     * token. Mirrors the PHP client: token and credentials are independent. A valid token keeps being
     * used; the credentials are only the fallback to mint/renew a token when none is valid.
     */
    public setClientCredentials(clientId: string | null, clientSecret: string | null, scopes: string[] = ['all']): void {
        this.options.clientId = clientId;
        this.options.clientSecret = clientSecret;
        this.options.scopes = scopes;
    }

    /**
     * Ensure a usable access token exists before a signed request. Token-first with credentials as a
     * fallback (mirrors the PHP client's lazy authenticate()): a valid token is left untouched; an
     * expired token carrying a refresh_token is refreshed; otherwise, if confidential client
     * credentials are configured, a token is minted via the client_credentials grant. Single-flighted
     * so concurrent requests share one acquisition.
     */
    private async ensureAccessToken(): Promise<void> {
        if (this.oauthClientToken !== null && !OAuthClientToken.isExpired(this.oauthClientToken)) {
            return;
        }
        if (this.tokenAcquisitionPromise === null) {
            this.tokenAcquisitionPromise = this.acquireToken();
            try {
                await this.tokenAcquisitionPromise;
            } finally {
                // Always clear, even on failure, so one failed acquisition doesn't poison every later
                // request with the same rejected promise.
                this.tokenAcquisitionPromise = null;
            }
        } else {
            await this.tokenAcquisitionPromise;
        }
    }

    private async acquireToken(): Promise<void> {
        // Expired token that carries a refresh_token → refresh grant (keeps the existing session).
        if (this.oauthClientToken !== null && OAuthClientToken.isExpired(this.oauthClientToken) && OAuthClient.hasRefreshToken(this.oauthClientToken)) {
            await this.refreshToken();
            return;
        }
        // No usable token (missing, or expired without a refresh_token): mint one from client
        // credentials if we have them. Public clients (no secret) can't use the client_credentials
        // grant, so they fall through and the caller gets a 401 — they must obtain a token another way.
        if (this.options.clientId !== null && !this.isPublicClient()) {
            await this.authenticate();
        }
    }

    private static hasRefreshToken(token: OAuthClientToken): boolean {
        return token.refresh_token !== undefined && token.refresh_token !== null && token.refresh_token !== '';
    }

    private isPublicClient(): boolean {
        return this.options.clientSecret === null || this.options.clientSecret === '';
    }

    /**
     * Performs an OAuth token request (password, client_credentials or refresh_token grant) and
     * returns the raw token response. On a non-ok response it throws a ClientError carrying the
     * server's HTTP status and, when the body is JSON, its structured error message.
     */
    private async requestToken(params: Record<string, string | null>): Promise<{
        access_token: string;
        token_type: string;
        refresh_token: string | undefined;
        expires_in: number;
        scope: string | undefined;
        scopes: string | undefined;
    }> {
        // The token endpoint bypasses HttpClient, so it does not inherit its timeout. Without one an
        // unresponsive token endpoint hangs authenticate()/refreshToken() forever — and that is the
        // one call every client makes before it can do anything else.
        const timeoutMs: number = this.options.timeoutMs;
        const init: RequestInit = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(params as Record<string, string>).toString(),
        };
        if (timeoutMs > 0) {
            init.signal = AbortSignal.timeout(timeoutMs);
        }

        const tokenUrl: string = this.getApiEndpointUrl(this.options.accessTokenUri);
        let response: Response;
        try {
            response = await fetch(tokenUrl, init);
        } catch (error: unknown) {
            // Matched on `name`, not instanceof: a DOMException from another realm (a test runner's VM
            // context, an iframe) is not an instance of this realm's Error. Same reasoning as HttpClient.
            if (typeof error === 'object' && error !== null && (error as {name?: unknown}).name === 'TimeoutError') {
                throw new ClientError('Token request to `' + tokenUrl + '` timed out after ' + timeoutMs + 'ms');
            }
            throw ClientError.fromError(error as Error);
        }

        if (!response.ok) {
            const clientError: ClientError = new ClientError(response.statusText || 'Token request failed', response.status);

            // The token endpoint bypasses HttpClient (and authenticate() bypasses Endpoint.toApiError),
            // so without this the server's body is discarded and callers only see the generic HTTP
            // statusText. Attach the body and surface its structured OAuth error message directly so a
            // failed login shows e.g. an invalid-credentials reason. Mirrors HttpClient.request() +
            // Endpoint.toApiError(). The refresh path replaces this message with a 401, so it's unaffected.
            try {
                const data: unknown = await response.json();
                clientError.response = {
                    status: response.status,
                    statusText: response.statusText,
                    data,
                };
                const apiMessage: string | undefined = (data as { error?: { message?: string } } | null)?.error?.message;
                if (apiMessage !== undefined && apiMessage !== null && apiMessage !== '') {
                    clientError.message = apiMessage;
                }
            } catch {
                // Response body is not JSON — leave response/message as-is
            }

            throw clientError;
        }

        return response.json();
    }

    public isTokenExpired(): boolean {
        if (this.oauthClientToken === null) {
            throw new Error('No token defined');
        }
        return OAuthClientToken.isExpired(this.oauthClientToken);
    }

    /**
     * Like `request`, but asks for and returns the raw bytes. For a resource that has a binary
     * representation — a stored item — where decoding would destroy it.
     */
    public async requestBytes(action: string, parameters: Parameters = null, method: string = 'GET', signWithOauthToken: boolean = true, headers: Record<string, string> = {}): Promise<Uint8Array> {
        if (signWithOauthToken) {
            await this.ensureAccessToken();
            if (this.oauthClientToken === null) {
                throw new ClientError('Unable to perform request, access token not provided', HttpStatus.HTTP_UNAUTHORIZED);
            }
        }

        const requestData: HttpClientRequest = this.createRequestData(action, parameters, method, signWithOauthToken);
        requestData.setHeader('Accept', 'application/octet-stream');
        for (const [name, value] of Object.entries(headers)) {
            requestData.setHeader(name, value);
        }

        const response: HttpClientResponse = await HttpClient.request(requestData, this.options.timeoutMs);
        return response.getBytes();
    }

    public async request<T>(action: string, parameters: Parameters = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<T> {
        if (signWithOauthToken) {
            // Token-first, credentials-as-fallback (mirrors the PHP client): use a valid token as-is,
            // otherwise refresh or mint one from client credentials. Only when nothing is available do
            // we 401 — the same sign-out path consumers already handle for a rejected refresh.
            await this.ensureAccessToken();
            if (this.oauthClientToken === null) {
                throw new ClientError('Unable to perform request, access token not provided', HttpStatus.HTTP_UNAUTHORIZED);
            }
        }

        const requestData: HttpClientRequest = this.createRequestData(action, parameters, method, signWithOauthToken);
        if (this.debug) {
            console.debug('[OAuthClient] Request: ' + requestData.method.toUpperCase() + ' ' + requestData.getFullUrl(), {headers: requestData.headers});
        }
        try {
            const response: HttpClientResponse = await HttpClient.request(requestData, this.options.timeoutMs);
            return response.getJson<T>() as T;
        } catch (error: unknown) {
            if (!(error instanceof ClientError)) {
                const clientError: Error = ClientError.fromError(error as Error);
                if (this.debug) {
                    console.error('[Client] Error:', {error, clientError});
                }
                throw clientError;
            }
            if (this.debug) {
                console.error('[Client] Error:', {error});
            }
            throw error;
        }
    }

    /**
     * Overall budget for a single request, in milliseconds. Applies to the token request too, so a
     * raised budget covers authentication as well.
     *
     * There is no separate connect timeout, unlike the PHP client: `AbortSignal.timeout` bounds the
     * whole exchange and fetch exposes no connect phase to bound on its own.
     */
    public setTimeout(timeoutMs: number): void {
        this.options.timeoutMs = timeoutMs;
    }

    public isAuthenticated(): boolean {
        // TODO: other ways to determine if the client is authenticated?
        return this.oauthClientToken !== null && this.oauthClientToken !== undefined;
    }

    public getToken(): OAuthClientToken | null {
        return this.oauthClientToken;
    }

    public setToken(token: OAuthClientToken): void {
        this.oauthClientToken = token;
    }

    public unsetToken(): void {
        this.oauthClientToken = null;
    }

    /**
     * Observe tokens the client acquires or discards on its own. See {@link TokenChangeHandler}.
     * Pass null to stop observing.
     */
    public setTokenChangeHandler(handler: TokenChangeHandler | null): void {
        this.tokenChangeHandler = handler;
    }

    /**
     * The single place the client updates its own token, so no acquisition path can change it
     * without the handler hearing about it.
     */
    private applyToken(token: OAuthClientToken | null): void {
        this.oauthClientToken = token;
        if (this.tokenChangeHandler === null) {
            return;
        }
        try {
            this.tokenChangeHandler(token);
        } catch (error: unknown) {
            // A consumer's persistence failure must not fail the authentication that succeeded —
            // the token in memory is valid either way. Report it: silently dropping it would hide
            // exactly the stale-token bug this handler exists to prevent.
            console.error('[OAuthClient] Token change handler threw', {error});
        }
    }

    public enableDebug(): void {
        this.debug = true;
    }

    public disableDebug(): void {
        this.debug = false;
    }

    public isDebugEnabled(): boolean {
        return this.debug;
    }

    public setParseErrorHandler(handler: ParseErrorHandler | null): void {
        this.parseErrorHandler = handler;
    }

    public reportParseError(message: string, context: Record<string, unknown>): void {
        if (this.parseErrorHandler !== null) {
            this.parseErrorHandler(message, context);
            return;
        }
        console.error(message, context);
    }

    private defaultHeaders: Headers = {};

    /**
     * A copy, not the live object. Returning the internal map let callers mutate it by accident: a
     * request assigned it and then set its own headers, so `Authorization` (and `Attlaz-API-Version`)
     * were written into the shared defaults and sent on every later request — including the ones that
     * deliberately pass `signWithOauthToken: false` (password reset, email confirmation, invite
     * lookup, health). {@link addDefaultHeader} is the only way to add a real default.
     */
    public getDefaultHeaders(): Headers {
        return {...this.defaultHeaders};
    }

    private initDefaultHeaders(): void {
        const userAgentInfo: { version: string; language: string; language_version: string; publisher: string } = {
            version: VERSION,
            language: 'Javascript',
            language_version: '',
            publisher: 'Attlaz',
        };

        const headers: Headers = {'X-Attlaz-Client': JSON.stringify(userAgentInfo)};
        if (this.isNodeEnvironment()) {
            headers['User-Agent'] = 'Attlaz Http/' + VERSION;
        }
        this.defaultHeaders = headers;
    }

    public addDefaultHeader(header: string, value: string): void {
        this.defaultHeaders[header] = value;
    }

    public setVersion(version: string | null): void {
        this.version = version;
    }

    private isNodeEnvironment(): boolean {
        return typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null;
    }

    private tokenToOauthClientToken(oauthToken: {
        access_token: string;
        token_type: string;
        refresh_token: string | undefined;
        expires_in: number;
        scope: string | undefined;
        scopes: string | undefined;
    }): OAuthClientToken {
        let scopes: string = '';
        if (Object.prototype.hasOwnProperty.call(oauthToken, 'scopes') && oauthToken.scopes !== undefined) {
            scopes = oauthToken.scopes;
        } else if (Object.prototype.hasOwnProperty.call(oauthToken, 'scope') && oauthToken.scope !== undefined) {
            scopes = oauthToken.scope;
        }
        const refreshToken: string | null = oauthToken.refresh_token === undefined || oauthToken.refresh_token === null ? null : oauthToken.refresh_token;

        const token: OAuthClientToken = new OAuthClientToken(oauthToken.access_token, oauthToken.token_type, refreshToken, scopes);

        const t: Date = new Date();
        t.setSeconds(t.getSeconds() + oauthToken.expires_in);
        token.expires = t;

        return token;
    }

    private getApiEndpointUrl(uri: string): string {
        if (uri.startsWith('http://') || uri.startsWith('https://')) {
            return uri;
        }
        return this.options.apiEndpoint.replace(/\/+$/, '') + '/' + uri.replace(/^\/+/g, '');
    }

    private createRequestData(action: string, parameters: Parameters | null = null, method: string = 'GET', signWithOauthToken: boolean = true): HttpClientRequest {
        const url: string = this.getApiEndpointUrl(action);

        let requestData: HttpClientRequest = new HttpClientRequest(url, method);
        requestData.headers = this.getDefaultHeaders();
        // Stated explicitly, even though JSON is what the API returns by default today. The server
        // plans to make bytes the default once no request arrives without an Accept, and a silent
        // client is indistinguishable from one that did not care — which is what makes that flip
        // unsafe. An endpoint wanting another representation overrides this afterwards.
        requestData.setHeader('Accept', 'application/json');
        if (this.version !== null) {
            requestData.setHeader('Attlaz-API-Version', this.version);
        }
        if ((method === 'POST' || method === 'DELETE' || method === 'PUT' || method === 'PATCH') && parameters !== null && parameters !== undefined) {
            // Raw bytes are the payload, not something to serialise. Stringifying them yields
            // {"type":"Buffer","data":[…]} — larger than the bytes and not what any reader expects.
            // Tested with instanceof rather than Buffer.isBuffer: Buffer is a Node global and this
            // package runs in the browser, where naming it at all is a ReferenceError. A Buffer is
            // a Uint8Array, so this still catches one.
            if (parameters instanceof Uint8Array) {
                requestData.body = parameters;
                requestData.setHeader('Content-Type', 'application/octet-stream');
            } else if (typeof parameters === 'object') {
                requestData.body = JsonSerializable.stringify(parameters);
                requestData.setJsonHeader();
            } else if (typeof parameters === 'string') {
                requestData.body = parameters;
                requestData.setJsonHeader();
            } else {
                console.error('Unknown parameter type: ' + typeof parameters);
                requestData.setJsonHeader();
            }
        }
        if (method === 'GET' && parameters !== null && parameters !== undefined) {
            const params = parameters as Record<string, string | number>;
            Object.keys(params).forEach((key: string) => {
                requestData.addQueryParam(key, params[key]);
            });
        }

        if (signWithOauthToken) {
            // request() already ensured a present, non-expired token; this guard only narrows
            // the type before signing.
            if (this.oauthClientToken === null) {
                throw new ClientError('Unable to perform request, access token not provided', HttpStatus.HTTP_UNAUTHORIZED);
            }
            requestData = this.signRequest(requestData, this.oauthClientToken);
        }
        return requestData;
    }

    private signRequest(requestObject: HttpClientRequest, token: OAuthClientToken): HttpClientRequest {
        const tokenType: string | undefined = token.token_type;
        const accessToken: string = token.access_token;
        if (tokenType !== undefined && tokenType.toLowerCase() === 'bearer') {
            requestObject.setHeader('Authorization', 'Bearer ' + accessToken);
        } else {
            throw new ClientError('Unsupported token type "' + (tokenType ?? 'undefined') + '": only Bearer tokens are supported');
        }

        return requestObject;
    }
}
