export class SourcesAccount {
    public id: number;
    public key: string;
    public name: string;
    public user: string;
    public type: string;
    public access_token: string;
    public refresh_token: string;
    public scopes: string;

    public static parse(rawSourcesAccount: any): SourcesAccount {
        let sourcesAccount: SourcesAccount = new SourcesAccount();
        sourcesAccount.id = rawSourcesAccount.id;
        sourcesAccount.key = rawSourcesAccount.key;
        sourcesAccount.name = rawSourcesAccount.name;
        sourcesAccount.user = rawSourcesAccount.user;
        sourcesAccount.type = rawSourcesAccount.type;
        sourcesAccount.access_token = rawSourcesAccount.access_token;
        sourcesAccount.refresh_token = rawSourcesAccount.refresh_token;
        sourcesAccount.scopes = rawSourcesAccount.scopes;
        return sourcesAccount;

    }
}
