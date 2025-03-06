import {clientCredentials, ownerCredentials, refreshToken} from 'axios-oauth-client';
import axios, {AxiosInstance} from 'axios';
import {VERSION} from '../version.js';
import {JsonSerializable} from '../Model/JsonSerializable.js';
import {OAuthClientOptions} from './OAuthClientOptions.js';
import {ClientError} from './ClientError.js';
import {HttpClient} from './HttpClient.js';
import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {OAuthClientToken} from './OAuthClientToken.js';
import {Parameters} from './Data/Parameters.js';
import {Headers} from './Data/Headers.js';

export class OAuthClient {
    private debug: boolean = false;
    private axiosInstance: AxiosInstance | null = null;

    private oathClientToken: OAuthClientToken | null = null;
    private refreshTokenPromise: Promise<void> | null = null;

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
                const getOwnerCredentials = ownerCredentials(
                    this.getAxiosInstance(),
                    this.getApiEndpointUrl(this.options.accessTokenUri),
                    this.options.clientId === null ? undefined : this.options.clientId,
                    this.options.clientSecret === null ? undefined : this.options.clientSecret,
                );

                const rawAuthToken = await getOwnerCredentials(username, password, this.options.scopes.join(' '));
                this.oathClientToken = this.tokenToOauthClientToken(rawAuthToken);


                return true;
            }
            // Client credentials flow
            const getClientCredentials = clientCredentials(
                this.getAxiosInstance(),
                this.getApiEndpointUrl(this.options.accessTokenUri),
                this.options.clientId === null ? undefined : this.options.clientId,
                this.options.clientSecret === null ? undefined : this.options.clientSecret,
            );
            const rawAuthToken = await getClientCredentials(this.options.scopes.join(' '));
            // console.log('Raw token', rawAuthToken);
            this.oathClientToken = this.tokenToOauthClientToken(rawAuthToken);

            // const getRefreshToken = refreshToken(
            //     this.getAxiosInstance(),
            //     this.getApiEndpointUrl(this.options.accessTokenUri),
            //     this.options.clientId === null ? undefined : this.options.clientId,
            //     this.options.clientSecret === null ? undefined : this.options.clientSecret,
            // );
            // const auth = await getRefreshToken(this.oathClientToken.access_token, this.options.scopes.join(' '))
            // console.log('Refresh token', auth);
            return true;
        } catch (requestError: any) {
            if (this.debug) {
                console.debug('[Client] Error during authentication', requestError);
            }
            throw ClientError.fromError(requestError);
        }
    }

    public async refreshToken(): Promise<void> {
        if (this.debug) {
            console.debug('[OAuthClient] refresh token');
        }
        if (this.oathClientToken === null) {
            throw new Error('unable to refresh token, auth token not set');
        }
        if (this.oathClientToken.refresh_token === undefined || this.oathClientToken.refresh_token === null || this.oathClientToken.refresh_token === '') {
            throw new Error('unable to refresh token, refresh token not set');
        }

        try {
            const getRefreshToken = refreshToken(
                this.getAxiosInstance(),
                this.getApiEndpointUrl(this.options.accessTokenUri),
                this.options.clientId === null ? undefined : this.options.clientId,
                this.options.clientSecret === null ? undefined : this.options.clientSecret,
            );
            const auth = await getRefreshToken(this.oathClientToken.refresh_token, this.options.scopes.join(' '));
            this.oathClientToken = this.tokenToOauthClientToken(auth);
        } catch (e: any) {
            throw ClientError.fromError(e);
        }
    }


    private getAxiosInstance(): AxiosInstance {
        if (this.axiosInstance === null) {

            const config:{} = {
                // httpsAgent: new https.Agent({
                //     rejectUnauthorized: false,
                // }),
            };

            this.axiosInstance = axios.create(config);
        }
        return this.axiosInstance;
    }

    public isTokenExpires(): boolean {
        if (this.oathClientToken === null) {
            throw new Error('No token defined');
        }
        return OAuthClientToken.isExpired(this.oathClientToken);
    }

    public async request(action: string, parameters: Parameters = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<any> {
        if (signWithOauthToken && !this.isAuthenticated()) {
            throw new ClientError('Unable to perform request, access token not provided');
        } else {
            if (signWithOauthToken) {
                if (this.oathClientToken === null) {
                    throw new ClientError('Unable to perform request, access token not provided');
                }
                if (signWithOauthToken && OAuthClientToken.isExpired(this.oathClientToken)) {
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
                console.debug('[OAuthClient] Request: ' + requestData.method.toUpperCase() + ' ' + requestData.getFullUrl(), {headers: requestData.headers});
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
                if (this.debug) {
                    console.error('[Client] Error:', {error});
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
        return this.oathClientToken;
    }

    public setToken(token: OAuthClientToken): void {
        this.oathClientToken = token;
    }

    public unsetToken(): void {
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

    private defaultHeaders: Headers = {};

    public getDefaultHeaders(): Headers {
        return this.defaultHeaders;
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

    private isNodeEnvironment(): boolean {
        return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
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
        if (uri.indexOf('http://') === 0 || uri.indexOf('https://') === 0) {
            return uri;
        }
        return this.options.apiEndpoint.replace(/\/+$/, '') + '/' + uri.replace(/^\/+/g, '');
    }

    private createRequestData(action: string, parameters: Parameters | null = null, method: string = 'GET', signWithOauthToken: boolean = true): HttpClientRequest {
        const url: string = this.getApiEndpointUrl(action);

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
            if (this.oathClientToken === null) {
                throw new ClientError('Unable to perform request, access token not provided');
            }
            if (OAuthClientToken.isExpired(this.oathClientToken)) {
                throw new Error('Unable to sign request, token is expired');
            }

            requestData = this.signRequest(requestData);
        }
        return requestData;
    }

    private signRequest(requestObject: HttpClientRequest): HttpClientRequest {
        if (this.oathClientToken === null) {
            throw new ClientError('Unable to sign request, access token not provided');
        }
        if (OAuthClientToken.isExpired(this.oathClientToken)) {
            throw new Error('Unable to sign request, token is expired');
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
