import {State} from '../State';

export class Project {
    public id: string;
    public key: string;
    public name: string;
    public team: string;
    public default: boolean = false;

    public defaultEnvironmentId: string;

    public source_account: number;
    public source_repository: string;
    public language: number;

    public state: State = State.Active;

    constructor(id: string, key: string, name: string) {
        this.id = id;
        this.key = key;
        this.name = name;
    }

    public static parse(rawProject: any): Project {
        let project: Project = new Project(rawProject.id, rawProject.key, rawProject.name);

        project.team = rawProject.team;
        if (rawProject.default !== null && rawProject.default !== undefined) {
            project.default = (rawProject.default.toString() === '1');
        }

        project.defaultEnvironmentId = rawProject.defaultEnvironmentId;

        project.source_account = rawProject.source_account;
        project.source_repository = rawProject.source_repository;
        project.language = rawProject.language;

        project.state = State.fromString(rawProject.state);
        return project;
    }
}
