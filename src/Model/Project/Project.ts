import {State} from '../State';
import {StateAware} from '../StateAware';
import {Utils} from '../../Utils';

export class Project implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public teamId: string;
    public default: boolean = false;

    public defaultEnvironmentId: string;

    public state: State = State.Active;

    constructor(id: string, key: string, name: string) {
        this.id = id;
        this.key = key;
        this.name = name;
    }

    public static parse(rawProject: any): Project {
        let project: Project = new Project(rawProject.id, rawProject.key, rawProject.name);

        if (rawProject.team !== undefined) {
            project.teamId = rawProject.team;
        } else {
            project.teamId = rawProject.teamId;
        }

        if (rawProject.default !== null && rawProject.default !== undefined) {
            project.default = Utils.isTrue(rawProject.default);
        }

        project.defaultEnvironmentId = rawProject.defaultEnvironmentId;

        project.state = State.fromString(rawProject.state);
        return project;
    }
}
