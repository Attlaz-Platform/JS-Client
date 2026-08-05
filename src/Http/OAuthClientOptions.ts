import {HttpClient} from './HttpClient.js';

export class OAuthClientOptions {
    public accessTokenUri: string = 'oauth/token';
    public authorizationUri: string = 'oauth/authorize';
    public redirectUri: string = 'https://example.com/auth/github/callback';
    public scopes: string[] = [];
    public state: string = '';

    /** Overall budget for one request, in milliseconds. Set 0 to disable (not recommended). */
    public timeoutMs: number = HttpClient.DEFAULT_TIMEOUT_MS;

    constructor(
        public apiEndpoint: string,
        // Mutable so client credentials can be updated in place (see OAuthClient.setClientCredentials)
        // without recreating the client and losing its token.
        public clientId: string | null = null,
        public clientSecret: string | null = null,
    ) {

    }
}
