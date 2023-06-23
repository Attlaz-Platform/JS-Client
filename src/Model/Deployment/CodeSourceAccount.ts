export class CodeSourceAccount {
    public id: string;
    public key: string;
    public name: string;
    public userId: string;
    // public workspaceId: string;
    public type: string;
    // public access_token: string;
    // public refresh_token: string;
    // public scopes: string;

    public static parse(rawSourcesAccount: any): CodeSourceAccount {
        const sourcesAccount: CodeSourceAccount = new CodeSourceAccount();
        sourcesAccount.id = rawSourcesAccount.id;
        sourcesAccount.key = rawSourcesAccount.key;
        sourcesAccount.name = rawSourcesAccount.name;
        sourcesAccount.userId = rawSourcesAccount.user;
        // sourcesAccount.workspaceId = rawSourcesAccount.workspace;
        sourcesAccount.type = rawSourcesAccount.type;
        // sourcesAccount.access_token = rawSourcesAccount.access_token;
        // sourcesAccount.refresh_token = rawSourcesAccount.refresh_token;
        // sourcesAccount.scopes = rawSourcesAccount.scopes;
        return sourcesAccount;
    }
}
