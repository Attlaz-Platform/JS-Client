import {OAuthClientOptions} from './OAuthClientOptions';
import {ClientError} from '../Model/Error/ClientError';
import {Token} from 'client-oauth2';
import {HttpClient} from './HttpClient';
import {HttpClientRequest} from './HttpClientRequest';
import {Utils} from '../Utils';
import ClientOAuth2 = require('client-oauth2');

export class OAuthClient {

    private options: OAuthClientOptions;

    private debug: boolean = false;

    private oauthClient: ClientOAuth2;

    private oauthToken: Token;

    constructor(options: OAuthClientOptions) {

        this.options = options;

        this.oauthClient = new ClientOAuth2({
            clientId: this.options.clientId,
            clientSecret: this.options.clientSecret,
            accessTokenUri: this.getUri(this.options.accessTokenUri),
            authorizationUri: this.getUri(this.options.authorizationUri),
            redirectUri: this.options.redirectUri,
            scopes: this.options.scopes,
            state: this.options.state
        })

    }

    public getClient(): ClientOAuth2 {
        return this.oauthClient;
    }

    public async authenticate(username: string, password: string): Promise<boolean>;
    public async authenticate(): Promise<boolean>;
    public async authenticate(username?: string, password?: string): Promise<boolean> {
        //TODO: should we encrypt the password in the client (or is https save enough)?

        try {
            let token: Token;
            if (!Utils.isNullOrUndefined(username) && !Utils.isNullOrUndefined(password)) {
                token = await this.oauthClient.owner.getToken(username, password);
            } else {
                token = await this.oauthClient.credentials.getToken();
            }
            this.oauthToken = token;
            return true;
        } catch (e) {
            throw ClientError.fromError(e);
        }

    }

    public async request(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<any> {

        if (signWithOauthToken && !this.isAuthenticated()) {
            throw new ClientError('Unable to perform request, access token not provided');
        } else {

            const requestData: HttpClientRequest = this.createRequestData(action, parameters, method, signWithOauthToken);

            if (this.debug) {
                console.info('[Client request] ', requestData);
            }

            try {

                return HttpClient.request(requestData);

            } catch (e) {
                throw ClientError.fromError(e);
            }
        }

    }

    public isAuthenticated(): boolean {
        //TODO: other ways to determine if the client is authenticated?
        return this.oauthToken !== null && this.oauthToken !== undefined;
    }

    public async refreshToken(accessToken: string, refreshToken: string): Promise<Token> {
        const token: Token = await this.oauthClient.createToken(accessToken, refreshToken, {});
        const newToken: Token = await token.refresh();

        return newToken;
    }

    public getAccessToken(): string {
        return this.oauthToken.accessToken;
    }

    public setAccessToken(accessToken: string) {
        this.oauthToken = this.oauthClient.createToken(accessToken, {});
    }

    public unsetAccessToken(): void {
        this.oauthToken = null;
    }

    public enableDebug() {
        this.debug = true;
    }

    public disableDebug() {
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

    private encodeQueryString(params: any): string {

        return Object.keys(params)
            .map(k => `${k}=${encodeURI(params[k])}`)
            .join('&');
    }

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
            requestData.url = requestData.url + '?' + this.encodeQueryString(parameters);
        }

        if (signWithOauthToken) {
            return this.oauthToken.sign(requestData);
        } else {
            return requestData;
        }
    }

}
