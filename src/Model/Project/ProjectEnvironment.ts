import {State} from '../State';
import {Utils} from '../../Utils';

export class ProjectEnvironment {
    public id: number;
    public key: string;
    public projectId: string;
    public name: string;
    public sourceBranch: string;
    public parent: number = null;
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
