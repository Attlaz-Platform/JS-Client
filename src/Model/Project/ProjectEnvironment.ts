import {State} from '../State';
import {Utils} from '../../Utils';
import {StateAware} from '../StateAware';

export class ProjectEnvironment implements StateAware {
    public id: string;
    public key: string;
    public projectId: string;
    public name: string;
    public sourceBranch: string;
    public parent: string | null = null;
    public isLocal: boolean = false;
    public state: State = State.Active;

    public static parse(rawProjectEnvironment: any): ProjectEnvironment {
        const projectEnvironment: ProjectEnvironment = new ProjectEnvironment();

        projectEnvironment.id = rawProjectEnvironment.id;
        projectEnvironment.key = rawProjectEnvironment.key;
        projectEnvironment.projectId = rawProjectEnvironment.project;
        projectEnvironment.name = rawProjectEnvironment.name;
        projectEnvironment.sourceBranch = rawProjectEnvironment.source_branch;
        projectEnvironment.parent = rawProjectEnvironment.parent;
        projectEnvironment.isLocal = Utils.isTrue(rawProjectEnvironment.is_local);
        projectEnvironment.state = State.fromString(rawProjectEnvironment.state);
        return projectEnvironment;
    }
}
