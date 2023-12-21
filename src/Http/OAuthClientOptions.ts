export class OAuthClientOptions {
    public accessTokenUri: string = 'oauth/token';
    public authorizationUri: string = 'oauth/authorize';
    public redirectUri: string = 'https://example.com/auth/github/callback';
    public scopes: string[] = ['all'];
    public state: string = 'xyz';

    constructor(public apiEndpoint: string, public readonly clientId: string | null = null, public readonly clientSecret: string | null = null) {

    }
}
