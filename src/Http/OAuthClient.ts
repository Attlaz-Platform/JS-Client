import {OAuthClientOptions} from './OAuthClientOptions';
import {ClientError} from '../Model/Error/ClientError';
import {HttpClient} from './HttpClient';
import {HttpClientRequest} from './HttpClientRequest';
import {HttpClientResponse} from './HttpClientResponse';
import {OAuthClientToken} from './OAuthClientToken';
import ClientOAuth2, {Token} from 'client-oauth2';
import {JsonSerializable} from '../Model/JsonSerializable';

export class OAuthClient {

    private debug: boolean = false;

    private oauthClient: ClientOAuth2;

    private oauthToken: Token | null = null;
    private oathClientToken: OAuthClientToken | null = null;

    constructor(private readonly options: OAuthClientOptions) {
        this.oauthClient = new ClientOAuth2({
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            accessTokenUri: this.getUri(options.accessTokenUri),
            authorizationUri: this.getUri(options.authorizationUri),
            redirectUri: options.redirectUri,
            scopes: options.scopes,
            state: options.state,
            headers: options.headers
        });

    }

    public async authenticate(username: string, password: string): Promise<boolean>;
    public async authenticate(): Promise<boolean>;
    public async authenticate(username: string | null = null, password: string | null = null): Promise<boolean> {
        //TODO: should we encrypt the password in the client (or is https save enough)?
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

    private refreshTokenPromise: Promise<void> | null = null;

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

    public async request(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<any> {

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

                const response: HttpClientResponse = await HttpClient.request2(requestData)

                // if (this.debug) {
                //     console.info('[Client response] ', {body: response.body});
                // }
                return response.body;

            } catch (error) {

                const clientError: Error = ClientError.fromError(error);
                if (this.debug) {
                    console.error('[Client] Error:', {error, clientError});
                }
                throw clientError;
            }
        }

    }

    public isAuthenticated(): boolean {
        //TODO: other ways to determine if the client is authenticated?
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
            scope: token.scope

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

    private tokenToOauthClientToken(oauthToken: Token): OAuthClientToken {
        const token: OAuthClientToken = new OAuthClientToken(oauthToken.accessToken, oauthToken.tokenType, oauthToken.refreshToken, oauthToken.data.scopes)

        const rawTokenExpires = (oauthToken as any as { expires: Date }).expires;
        if (rawTokenExpires !== null && rawTokenExpires !== undefined) {
            token.expires = rawTokenExpires;
        }
        return token;
    }

    private getUri(uri: string): string {

        if (uri.indexOf("http://") == 0 || uri.indexOf("https://") == 0) {
            return uri;
        }
        return this.options.apiEndpoint.replace(/\/+$/, "") + '/' + uri.replace(/^\/+/g, '');

    }

    private createRequestData(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): HttpClientRequest {

        const url: string = this.getUri(action);

        let requestData: HttpClientRequest = new HttpClientRequest(url, method);

        if ((method === 'POST' || method === 'DELETE' || method === 'PUT') && parameters !== null && parameters !== undefined) {
            if (typeof parameters === 'object') {
                parameters = JsonSerializable.stringify(parameters);
            } else if (typeof parameters === 'string') {

            } else {
                console.error('Unknown parameter type: ' + typeof parameters);
            }

            requestData.body = parameters;
            requestData.setJsonHeader();
        }
        if (method === 'GET' && parameters !== null && parameters !== undefined) {

            Object.keys(parameters).forEach((key: string, index: number) => {
                const value: string | number = parameters[key];
                requestData.addQueryParam(key, value);
            })
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

        return requestObject
    }

}
