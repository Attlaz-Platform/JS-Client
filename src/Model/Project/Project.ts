import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class Project extends MetaDataAware implements StateAware {
    public id: string;
    public key: string;
    public workspaceId: string;
    public defaultEnvironmentId: string;
    public state: State = State.Active;

    constructor(id: string, key: string, name: string) {
        super();
        this.id = id;
        this.key = key;
        this.name = name;
    }

    public static parse(rawProject: ApiRecord): Project {
        let project: Project = new Project(rawProject.id as string, rawProject.key as string, rawProject.name as string);
        project = MetaDataAware.parseMetaData(project, rawProject);
        project.workspaceId = rawProject.workspace as string;

        // if (rawProject.default !== null && rawProject.default !== undefined) {
        //     project.default = Utils.isTrue(rawProject.default);
        // }

        project.defaultEnvironmentId = rawProject.default_environment as string;
        project.state = State.fromString(rawProject.state as string);
        return project;
    }
}
