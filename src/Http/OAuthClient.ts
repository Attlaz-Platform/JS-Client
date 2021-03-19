import {OAuthClientOptions} from './OAuthClientOptions';
import {ClientError} from '../Model/Error/ClientError';
// import {Token} from 'client-oauth2';
import {HttpClient} from './HttpClient';
import {HttpClientRequest} from './HttpClientRequest';
import {Utils} from '../Utils';
import {HttpClientResponse} from './HttpClientResponse';
import {OAuthClientToken} from './OAuthClientToken';
import {Token} from 'client-oauth2';
import ClientOAuth2 = require('client-oauth2');

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

    // public getClient(): ClientOAuth2 {
    //     return this.oauthClient;
    // }

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
            throw ClientError.fromError(e);
        }

    }

    public async request(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<any> {

        if (signWithOauthToken && !this.isAuthenticated()) {
            throw new ClientError('Unable to perform request, access token not provided');
        } else {
            if (signWithOauthToken && this.oauthToken.expired()) {

                if (this.oauthToken.refreshToken !== undefined && this.oauthToken.refreshToken !== null && this.oauthToken.refreshToken !== '') {
                    this.oauthToken = await this.oauthToken.refresh();
                } else {
                    await this.authenticate();
                }
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

    // public async refreshToken(accessToken: string, refreshToken: string): Promise<AccessToken> {
    //
    //     const refreshParams = {
    //         scope: this.options.scopes,
    //     };
    //     this.oauthToken = await this.oauthToken.refresh(refreshParams);
    //     return this.oauthToken;
    // }

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
            scopes: this.oauthToken.data.scope
        };

    }

    public setToken(token: OAuthClientToken): void {

        const data: {} = {
            access_token: token.access_token,
            token_type: token.token_type,
            refresh_token: token.refresh_token,
            scope: token.scopes

        };
        const oauthToken: Token = this.oauthClient.createToken(data);
        oauthToken.expiresIn(token.expires);

        this.oauthToken = oauthToken;
    }

    // public async revokeToken(): Promise<void> {
    //     await this.oauthToken.revokeAll();
    // }

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

    private getUri(uri: string): string {

        if (uri.indexOf("http://") == 0 || uri.indexOf("https://") == 0) {
            return uri;
        }
        return this.options.apiEndpoint.replace(/\/+$/, "") + '/' + uri.replace(/^\/+/g, '');

    }

    // private encodeQueryString(params: any): string {
    //
    //     return Object.keys(params)
    //         .map(k => `${k}=${encodeURI(params[k])}`)
    //         .join('&');
    // }

    private createRequestData(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): HttpClientRequest {

        const url: string = this.getUri(action);

        let requestData: HttpClientRequest = new HttpClientRequest(url, method);

        if ((method === 'POST' || method === 'PUT') && parameters !== null && parameters !== undefined) {
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
            //     .map(k => `${k}=${encodeURI(params[k])}`)
            //     .join('&');
            // requestData.url = requestData.url + '?' + this.encodeQueryString(parameters);
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
        // requestObject.headers = requestObject.headers || {}

        // console.log(this.oauthToken);
        const tokenType: string = this.oauthToken.tokenType;
        const accessToken: string = this.oauthToken.accessToken;
        if (tokenType.toLowerCase() === 'bearer') {
            requestObject.setHeader('Authorization', 'Bearer ' + accessToken);
        } else {
            var parts = requestObject.url.split('#')
            var token = 'access_token=' + accessToken;
            var url = parts[0].replace(/[?&]access_token=[^&#]/, '')
            var fragment = parts[1] ? '#' + parts[1] : ''

            // Prepend the correct query string parameter to the url.
            requestObject.url = url + (url.indexOf('?') > -1 ? '&' : '?') + token + fragment

            // Attempt to avoid storing the url in proxies, since the access token
            // is exposed in the query parameters.
            requestObject.setHeader('Pragma', 'no-store');
            requestObject.setHeader('Cache-Control', 'no-store');
        }

        return requestObject
    }

}
