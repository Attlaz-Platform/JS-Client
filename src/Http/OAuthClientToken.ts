export class OAuthClientToken {
    public access_token: string = '';
    public token_type: string = '';
    public refresh_token: string | null = null;
    public expires: Date | null = null;
    public scope: string = '';

    public constructor(access_token: string, token_type: string, refresh_token: string, scope: string) {
        this.access_token = access_token;
        this.token_type = token_type;
        this.refresh_token = refresh_token;
        this.scope = scope;
    }

    public static isExpired(token: OAuthClientToken): boolean {
        if (token.expires === null) {
            return false;
        }
        return token.expires <= new Date()
    }

    public static serialize(token: OAuthClientToken): string {
        return JSON.stringify(token);
    }

    public static deserialize(serializedToken: string): OAuthClientToken {
        const token: OAuthClientToken = JSON.parse(serializedToken);
        if (token.expires !== null && token.expires !== undefined) {
            token.expires = new Date(token.expires);
        } else {
            token.expires = null;
        }
        return token;
    }

}
