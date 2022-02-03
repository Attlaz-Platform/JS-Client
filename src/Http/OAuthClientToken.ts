export class OAuthClientToken {
    public access_token: string;
    public token_type: string;
    public refresh_token: string | null;
    public expires: Date;
    public scope: string;

    public static isExpired(token: OAuthClientToken): boolean {
        console.log(token);
        return token.expires <= new Date()
    }

    public static serialize(token: OAuthClientToken): string {
        return JSON.stringify(token);
    }

    public static deserialize(serializedToken: string): OAuthClientToken {
        const token: OAuthClientToken = JSON.parse(serializedToken);
        token.expires = new Date(token.expires);
        return token;
    }

}
