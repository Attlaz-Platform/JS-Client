export class OAuthClientOptions {
    public accessTokenUri: string = 'oauth/token';
    public authorizationUri: string = 'oauth/authorize';
    public redirectUri: string = 'https://example.com/auth/github/callback';
    public scopes: string[] = [];
    public state: string = '';

    constructor(public apiEndpoint: string, public readonly clientId: string | null = null, public readonly clientSecret: string | null = null) {

    }
}
