import {State} from '../State.js';
import {Utils} from '../../Utils.js';
import {StateAware} from '../StateAware.js';

export class ProjectEnvironment implements StateAware {
    public id: string;
    public key: string;
    public projectId: string;
    public name: string;
    public codeSourceId: string | null = null;
    public parentId: string | null = null;
    public isLocal: boolean = false;
    public state: State = State.Active;

    public static parse(rawProjectEnvironment: any): ProjectEnvironment {
        const projectEnvironment: ProjectEnvironment = new ProjectEnvironment();
        projectEnvironment.id = rawProjectEnvironment.id.toString();
        projectEnvironment.key = rawProjectEnvironment.key;
        projectEnvironment.projectId = rawProjectEnvironment.project;
        projectEnvironment.name = rawProjectEnvironment.name;
        projectEnvironment.codeSourceId = rawProjectEnvironment.code_source;
        projectEnvironment.parentId = rawProjectEnvironment.parent;
        projectEnvironment.isLocal = Utils.isTrue(rawProjectEnvironment.is_local);
        projectEnvironment.state = State.fromString(rawProjectEnvironment.state);
        return projectEnvironment;
    }
}
