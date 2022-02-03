import {OAuthClientOptions} from './OAuthClientOptions';
import {ClientError} from '../Model/Error/ClientError';
import {HttpClient} from './HttpClient';
import {HttpClientRequest} from './HttpClientRequest';
import {Utils} from '../Utils';
import {HttpClientResponse} from './HttpClientResponse';
import {OAuthClientToken} from './OAuthClientToken';
import * as ClientOAuth2 from 'client-oauth2';
import {Token} from 'client-oauth2';

// import {Token} from 'client-oauth2';
// import ClientOAuth2 = require('client-oauth2');

export class OAuthClient {

    private options: OAuthClientOptions;

    private debug: boolean = false;

    private oauthClient: ClientOAuth2;

    private oauthToken: Token | null = null;

    constructor(options: OAuthClientOptions) {

        this.options = options;
        //
        this.oauthClient = new ClientOAuth2({
            clientId: this.options.clientId,
            clientSecret: this.options.clientSecret,
            accessTokenUri: this.getUri(this.options.accessTokenUri),
            authorizationUri: this.getUri(this.options.authorizationUri),
            redirectUri: this.options.redirectUri,
            scopes: this.options.scopes,
            state: this.options.state
        });

    }

    public async authenticate(username: string, password: string): Promise<boolean>;
    public async authenticate(): Promise<boolean>;
    public async authenticate(username?: string, password?: string): Promise<boolean> {
        //TODO: should we encrypt the password in the client (or is https save enough)?

        try {
            let accessToken: Token;
            if (!Utils.isNullOrUndefined(username) && !Utils.isNullOrUndefined(password)) {
                // Password flow
                accessToken = await this.oauthClient.owner.getToken(username, password);
            } else {
                // Client credentials flow
                accessToken = await this.oauthClient.credentials.getToken();
            }
            this.oauthToken = accessToken;
            return true;
        } catch (e) {
            console.log(e);
            throw ClientError.fromError(e);
        }

    }

    public async refreshToken(): Promise<void> {
        if (this.oauthToken.refreshToken !== undefined && this.oauthToken.refreshToken !== null && this.oauthToken.refreshToken !== '') {
            try {
                this.oauthToken = await this.oauthToken.refresh();
            } catch (e) {
                const error: ClientError = ClientError.fromError(e);
                throw error;
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
            if (signWithOauthToken && this.oauthToken.expired()) {

                await this.refreshToken();

            }

            const requestData: HttpClientRequest = this.createRequestData(action, parameters, method, signWithOauthToken);

            if (this.debug) {
                console.info('[Client request] ', requestData);
            }
            try {

                const response: HttpClientResponse = await HttpClient.request2(requestData);
                return response.body;

            } catch (e) {
                throw ClientError.fromError(e);
            }
        }

    }

    public isAuthenticated(): boolean {
        //TODO: other ways to determine if the client is authenticated?
        return this.oauthToken !== null && this.oauthToken !== undefined;
    }

    public getToken(): OAuthClientToken | null {

        if (this.oauthToken === null) {
            return null;
        }
        console.log(this.oauthToken.data);
        return {
            access_token: this.oauthToken.accessToken,
            token_type: this.oauthToken.tokenType,
            refresh_token: this.oauthToken.refreshToken,
            expires: (this.oauthToken as any as { expires: Date }).expires,
            scope: this.oauthToken.data.scope
        };

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
    }

    public unsetToken(): void {
        this.oauthToken = null;

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

    public getTokenFlowUrl(options: {
        query?: {
            [key: string]: string | string[];
        };
    } | null = null): string {
        return this.oauthClient.token.getUri(options);
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
                parameters = JSON.stringify(parameters);
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
            if (this.oauthToken.expired()) {
                throw new Error('Unable to sign request, token is expired');
            }

            requestData = this.signRequest(requestData);
        } else {

        }
        return requestData;
    }

    private signRequest(requestObject: HttpClientRequest): HttpClientRequest {
        const tokenType: string | undefined = this.oauthToken.tokenType;
        const accessToken: string = this.oauthToken.accessToken;
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
