import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class Project implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public workspaceId: string;
    public defaultEnvironmentId: string;
    public state: State = State.Active;

    constructor(id: string, key: string, name: string) {
        this.id = id;
        this.key = key;
        this.name = name;
    }

    public static parse(rawProject: any): Project {
        const project: Project = new Project(rawProject.id, rawProject.key, rawProject.name);
        project.workspaceId = rawProject.workspace;

        // if (rawProject.default !== null && rawProject.default !== undefined) {
        //     project.default = Utils.isTrue(rawProject.default);
        // }

        project.defaultEnvironmentId = rawProject.default_environment;

        project.state = State.fromString(rawProject.state);
        return project;
    }
}
