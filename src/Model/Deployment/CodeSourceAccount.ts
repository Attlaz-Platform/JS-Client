import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class CodeSourceAccount extends MetaDataAware implements StateAware {
    public id: string;
    public userId: string;
    public workspaceId: string;
    public type: string;
    // public access_token: string;
    // public refresh_token: string;
    // public scopes: string;
    public state: State;

    public static parse(rawSourcesAccount: ApiRecord): CodeSourceAccount {
        const sourcesAccount: CodeSourceAccount = MetaDataAware.parseMetaData(new CodeSourceAccount(), rawSourcesAccount);
        sourcesAccount.userId = rawSourcesAccount.user as string;
        sourcesAccount.workspaceId = rawSourcesAccount.workspace as string;
        sourcesAccount.type = rawSourcesAccount.type as string;
        // sourcesAccount.access_token = rawSourcesAccount.access_token;
        // sourcesAccount.refresh_token = rawSourcesAccount.refresh_token;
        // sourcesAccount.scopes = rawSourcesAccount.scopes;
        sourcesAccount.state = State.fromString(rawSourcesAccount.state as string);
        return sourcesAccount;
    }
}
