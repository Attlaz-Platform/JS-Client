import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class Workspace implements StateAware {
    id: string;
    name: string;
    key: string;
    state: State;

    public static parse(raw: any): Workspace {
        const workspace: Workspace = new Workspace();
        workspace.id = raw.id;
        workspace.name = raw.name;
        workspace.key = raw.key;
        workspace.state = State.fromString(raw.state);

        return workspace;
    }
}
