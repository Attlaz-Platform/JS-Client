export class OAuthClientOptions {
    apiEndpoint: string;
    clientId: string;
    clientSecret: string;
    accessTokenUri: string = 'oauth/token';
    authorizationUri: string = 'oauth/authorize';
    redirectUri: string = 'http://example.com/auth/github/callback';
    scopes: string[] = ['all'];
    state: string = 'xyz';

    constructor(apiEndpoint: string, clientId: string, clientSecret: string) {
        this.apiEndpoint = apiEndpoint;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
}
