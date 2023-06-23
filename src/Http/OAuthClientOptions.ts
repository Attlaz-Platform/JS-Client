import {Headers} from './Data/Header.js';

export class OAuthClientOptions {
    public apiEndpoint: string;
    public clientId: string;
    public clientSecret: string;
    public accessTokenUri: string = 'oauth/token';
    public authorizationUri: string = 'oauth/authorize';
    public redirectUri: string = 'https://example.com/auth/github/callback';
    public scopes: string[] = ['all'];
    public state: string = 'xyz';

    public headers: Headers;

    constructor(apiEndpoint: string, clientId: string, clientSecret: string, headers: Headers) {
        this.apiEndpoint = apiEndpoint;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.headers = headers;
    }
}
