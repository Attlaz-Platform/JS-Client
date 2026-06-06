import {ApiRecord} from '../ApiRecord.js';

export class ProviderTokenAccessToken {
    public accessToken:string;
    // When the access token expires — lets callers cache it for the run instead of re-fetching per call.
    public expiresAt: Date | null = null;

    public static parse(rawToken: ApiRecord): ProviderTokenAccessToken {
        const token = new ProviderTokenAccessToken();
        token.accessToken = rawToken.access_token as string;
        token.expiresAt = rawToken.expires_at !== undefined && rawToken.expires_at !== null ? new Date(rawToken.expires_at as string) : null;
        return token;
    }
}
