export class OAuthClientOptions {
    public accessTokenUri: string = 'oauth/token';
    public authorizationUri: string = 'oauth/authorize';
    public redirectUri: string = 'https://example.com/auth/github/callback';
    public scopes: string[] = [];
    public state: string = '';

    constructor(
        public apiEndpoint: string,
        // Mutable so client credentials can be updated in place (see OAuthClient.setClientCredentials)
        // without recreating the client and losing its token.
        public clientId: string | null = null,
        public clientSecret: string | null = null,
    ) {

    }
}
