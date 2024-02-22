import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class CodeSourceAccount implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public userId: string;
    // public workspaceId: string;
    public type: string;
    // public access_token: string;
    // public refresh_token: string;
    // public scopes: string;
    public state: State;

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
        sourcesAccount.state = State.fromString(rawSourcesAccount.state);
        return sourcesAccount;
    }
}
