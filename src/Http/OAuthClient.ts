import ClientOAuth2, {Token} from 'client-oauth2';
import {OAuthClientOptions} from './OAuthClientOptions.js';
import {ClientError} from './ClientError.js';
import {HttpClient} from './HttpClient.js';
import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {OAuthClientToken} from './OAuthClientToken.js';
import {JsonSerializable} from '../Model/JsonSerializable.js';
import {Parameters} from './Data/Parameters.js';
import {VERSION} from '../version.js';
import {Headers} from './Data/Header.js';

export class OAuthClient {
    private debug: boolean = false;

    private oauthClient: ClientOAuth2;

    private oauthToken: Token | null = null;
    private oathClientToken: OAuthClientToken | null = null;
    private refreshTokenPromise: Promise<void> | null = null;

    constructor(private readonly options: OAuthClientOptions) {
        this.oauthClient = new ClientOAuth2({
            clientId: options.clientId === null ? undefined : options.clientId,
            clientSecret: options.clientSecret === null ? undefined : options.clientSecret,
            accessTokenUri: this.getUri(options.accessTokenUri),
            authorizationUri: this.getUri(options.authorizationUri),
            redirectUri: options.redirectUri,
            scopes: options.scopes,
            state: options.state,
            headers: this.getDefaultHeaders(),
        });
    }

    public async authenticate(username: string, password: string): Promise<boolean>;

    public async authenticate(): Promise<boolean>;

    public async authenticate(username: string | null = null, password: string | null = null): Promise<boolean> {
        // TODO: should we encrypt the password in the client (or is https save enough)?
        try {
            let accessToken: Token;
            if (username !== null && username !== undefined && password !== null && password !== undefined) {
                // Password flow
                accessToken = await this.oauthClient.owner.getToken(username, password);
            } else {
                // Client credentials flow
                accessToken = await this.oauthClient.credentials.getToken();
            }
            this.oauthToken = accessToken;
            this.oathClientToken = this.tokenToOauthClientToken(this.oauthToken);
            return true;
        } catch (e) {
            if (this.debug) {
                console.debug('[Client] Error during authentication', e);
            }
            throw ClientError.fromError(e);
        }
    }

    public async refreshToken(): Promise<void> {
        if (this.debug) {
            console.debug('[OAuthClient] refresh token');
        }
        if (this.oauthToken === null) {
            throw new Error('unable to refresh token, auth token not set');
        }
        if (this.oauthToken.refreshToken !== undefined && this.oauthToken.refreshToken !== null && this.oauthToken.refreshToken !== '') {
            try {
                this.oauthToken = await this.oauthToken.refresh();
                this.oathClientToken = this.tokenToOauthClientToken(this.oauthToken);
            } catch (e) {
                throw ClientError.fromError(e);
            }
        } else {
            await this.authenticate();
        }
    }

    public isTokenExpires(): boolean {
        if (this.oauthToken === null) {
            throw new Error('No token defined');
        }
        return this.oauthToken.expired();
    }

    public async request(action: string, parameters: Parameters = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<any> {
        if (signWithOauthToken && !this.isAuthenticated()) {
            throw new ClientError('Unable to perform request, access token not provided');
        } else {
            if (signWithOauthToken) {
                if (this.oauthToken === null) {
                    throw new ClientError('Unable to perform request, access token not provided');
                }
                if (signWithOauthToken && this.oauthToken.expired()) {
                    if (this.refreshTokenPromise === null) {
                        this.refreshTokenPromise = this.refreshToken();
                        await this.refreshTokenPromise;
                        this.refreshTokenPromise = null;
                    } else {
                        await this.refreshTokenPromise;
                    }
                }
            }

            const requestData: HttpClientRequest = this.createRequestData(action, parameters, method, signWithOauthToken);


            if (this.debug) {
                console.debug('[OAuthClient] Request: ' + requestData.method.toUpperCase() + ' ' + requestData.getFullUrl());
            }
            try {
                const response: HttpClientResponse = await HttpClient.request(requestData);

                // if (this.debug) {
                //     console.info('[Client response] ', {body: response.body});
                // }
                return response.body;
            } catch (error: any) {
                if (!(error instanceof ClientError)) {
                    const clientError: Error = ClientError.fromError(error);
                    if (this.debug) {
                        console.error('[Client] Error:', {error, clientError});
                    }
                    throw clientError;
                }
                throw error;
            }
        }
    }

    public isAuthenticated(): boolean {
        // TODO: other ways to determine if the client is authenticated?
        return this.oathClientToken !== null && this.oathClientToken !== undefined;
    }

    public getToken(): OAuthClientToken | null {
        if (this.oauthToken === null) {
            return null;
        }

        if (this.oathClientToken === null) {
            this.oathClientToken = this.tokenToOauthClientToken(this.oauthToken);
        }

        return this.oathClientToken;
    }

    public setToken(token: OAuthClientToken): void {
        const data: {} = {
            access_token: token.access_token,
            token_type: token.token_type,
            refresh_token: token.refresh_token,
            scope: token.scope,

        };
        const oauthToken: Token = this.oauthClient.createToken(data);
        if (token.expires !== null && token.expires !== undefined) {
            oauthToken.expiresIn(token.expires);
        }

        this.oauthToken = oauthToken;
        this.oathClientToken = token;
    }

    public unsetToken(): void {
        this.oauthToken = null;
        this.oathClientToken = null;
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

    public getTokenFlowUrl(options: { query?: { [key: string]: string | string[] } } | null = null): string {
        return this.oauthClient.token.getUri(options === null ? undefined : options);
    }

    public getDefaultHeaders(): Headers {
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
        return headers;
    }

    private isNodeEnvironment(): boolean {
        return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
    }

    private tokenToOauthClientToken(oauthToken: Token): OAuthClientToken {

        let scopes: string = '';
        if (Object.prototype.hasOwnProperty.call(oauthToken.data, 'scopes')) {
            scopes = oauthToken.data.scopes;
        } else if (Object.prototype.hasOwnProperty.call(oauthToken.data, 'scope')) {
            scopes = oauthToken.data.scope;
        }
        const token: OAuthClientToken = new OAuthClientToken(oauthToken.accessToken, oauthToken.tokenType, oauthToken.refreshToken, scopes);

        const rawTokenExpires = (oauthToken as any as { expires: Date }).expires;
        if (rawTokenExpires !== null && rawTokenExpires !== undefined) {
            token.expires = rawTokenExpires;
        }
        return token;
    }

    private getUri(uri: string): string {
        if (uri.indexOf('http://') === 0 || uri.indexOf('https://') === 0) {
            return uri;
        }
        return this.options.apiEndpoint.replace(/\/+$/, '') + '/' + uri.replace(/^\/+/g, '');
    }

    private createRequestData(action: string, parameters: Parameters | null = null, method: string = 'GET', signWithOauthToken: boolean = true): HttpClientRequest {
        const url: string = this.getUri(action);

        let requestData: HttpClientRequest = new HttpClientRequest(url, method);
        requestData.headers = this.getDefaultHeaders();
        if ((method === 'POST' || method === 'DELETE' || method === 'PUT') && parameters !== null && parameters !== undefined) {
            if (typeof parameters === 'object') {
                requestData.body = JsonSerializable.stringify(parameters);
            } else if (typeof parameters === 'string') {
                requestData.body = parameters;
            } else {
                console.error('Unknown parameter type: ' + typeof parameters);
            }

            requestData.setJsonHeader();
        }
        if (method === 'GET' && parameters !== null && parameters !== undefined) {
            Object.keys(parameters).forEach((key: string, index: number) => {
                // @ts-ignore
                const value: string | number = parameters[key];
                requestData.addQueryParam(key, value);
            });
        }

        if (signWithOauthToken) {
            if (this.oauthToken === null) {
                throw new ClientError('Unable to perform request, access token not provided');
            }
            if (this.oauthToken.expired()) {
                throw new Error('Unable to sign request, token is expired');
            }

            requestData = this.signRequest(requestData);
        } else {

        }
        return requestData;
    }

    private signRequest(requestObject: HttpClientRequest): HttpClientRequest {
        if (this.oathClientToken === null) {
            throw new ClientError('Unable to sign request, access token not provided');
        }
        const tokenType: string | undefined = this.oathClientToken.token_type;
        const accessToken: string = this.oathClientToken.access_token;
        if (tokenType !== undefined && tokenType.toLowerCase() === 'bearer') {
            requestObject.setHeader('Authorization', 'Bearer ' + accessToken);
        } else {
            requestObject.addQueryParam('access_token', accessToken);
            // Attempt to avoid storing the url in proxies, since the access token
            // is exposed in the query parameters.
            requestObject.setHeader('Pragma', 'no-store');
            requestObject.setHeader('Cache-Control', 'no-store');
        }

        return requestObject;
    }
}
