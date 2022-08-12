import {State} from '../State';
import {Utils} from '../../Utils';
import {StateAware} from '../StateAware';

export class ProjectEnvironment implements StateAware {
    public id: string;
    public key: string;
    public projectId: string;
    public name: string;
    /** @deprecated **/
    public sourceBranch: string;
    public parentId: string | null = null;
    public isLocal: boolean = false;
    public state: State = State.Active;

    public static parse(rawProjectEnvironment: any): ProjectEnvironment {
        const projectEnvironment: ProjectEnvironment = new ProjectEnvironment();

        projectEnvironment.id = rawProjectEnvironment.id;
        projectEnvironment.key = rawProjectEnvironment.key;

        if (rawProjectEnvironment.project !== undefined) {
            projectEnvironment.projectId = rawProjectEnvironment.project;
        } else {
            projectEnvironment.projectId = rawProjectEnvironment.projectId;
        }

        projectEnvironment.name = rawProjectEnvironment.name;
        projectEnvironment.sourceBranch = rawProjectEnvironment.source_branch;
        if (rawProjectEnvironment.parent !== undefined) {
            projectEnvironment.parentId = rawProjectEnvironment.parent;
        } else {
            projectEnvironment.parentId = rawProjectEnvironment.parentId;
        }
        projectEnvironment.isLocal = Utils.isTrue(rawProjectEnvironment.is_local);
        projectEnvironment.state = State.fromString(rawProjectEnvironment.state);
        return projectEnvironment;
    }
}
