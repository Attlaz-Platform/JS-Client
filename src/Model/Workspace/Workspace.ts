import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class Workspace extends MetaDataAware implements StateAware {
    id: string;
    key: string;
    state: State;

    public static parse(raw: ApiRecord): Workspace {
        const workspace: Workspace = MetaDataAware.parseMetaData(new Workspace(), raw);
        workspace.id = raw.id as string;
        workspace.key = raw.key as string;
        workspace.state = State.fromString(raw.state as string);

        return workspace;
    }
}
