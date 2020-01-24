import {OAuthClientOptions} from './OAuthClientOptions';
import {ClientError} from '../Model/Error/ClientError';
import {Token} from 'client-oauth2';
import {Response} from 'servie';
import {fetch} from 'popsicle';
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

    public async authenticate(username: string, password: string): Promise<boolean>;
    public async authenticate(): Promise<boolean>;
    public async authenticate(username?: string, password?: string): Promise<boolean> {
        //TODO: should we encrypt the password in the client (or is https save enough)?

        try {
            let token: Token;
            if (username !== null && username !== undefined && password !== null && password !== undefined) {
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

    private createRequestData(action: string, parameters: any = null, method: string = 'GET'): any {

        const url: string = this.getUri(action);

        let requestData: any = {
            url: url,
            method: method,
        };

        if (method === 'POST' && parameters !== null && parameters !== undefined) {
            requestData.body = parameters;
        }
        if (method === 'GET' && parameters !== null && parameters !== undefined) {
            requestData.url = requestData.url + '?' + this.encodeQueryString(parameters);
        }

        return this.oauthToken.sign(requestData);
    }

    public async request(action: string, parameters: any = null, method: string = 'GET'): Promise<any> {

        if (!this.isAuthenticated()) {
            throw new ClientError('Unable to perform request, access token not provided');
        } else {

            const requestData: any = this.createRequestData(action, parameters, method);

            if (this.debug) {
                console.info('[Client request] ', requestData);
            }

            try {

                const response: Response = await fetch(requestData.url, requestData);

                //TODO: validate status
                switch (response.status) {
                    case 401:
                        //Unauthorized
                        console.error(response.statusText);
                        throw new ClientError('Unauthorized');
                        break;
                }

                // requestData = null;
                // signedRequestData = null;

                const body: any = await response.json();
                return body;

            } catch (e) {
                throw ClientError.fromError(e);
            }
        }

    }

    public isAuthenticated(): boolean {
        //TODO: other ways to determine if the client is authenticated?
        return this.oauthToken !== null && this.oauthToken !== undefined;
    }

    public getAccessToken(): string {
        return this.oauthToken.accessToken;
    }

    public setAccessToken(accessToken: string) {
        this.oauthToken = this.oauthClient.createToken(accessToken, {});
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

}
