import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {ApiRecord} from '../ApiRecord.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {ProjectEnvironmentType} from './ProjectEnvironmentType.js';

export class ProjectEnvironment extends MetaDataAware implements StateAware {
    public id: string;
    public key: string;
    public projectId: string;
    public codeSourceId: string | null = null;
    public parentId: string | null = null;
    public defaultRunnerPoolId: string | null = null;
    public type: ProjectEnvironmentType = ProjectEnvironmentType.Production;
    public state: State = State.Active;

    public static parse(rawProjectEnvironment: ApiRecord): ProjectEnvironment {
        const projectEnvironment: ProjectEnvironment = MetaDataAware.parseMetaData(new ProjectEnvironment(), rawProjectEnvironment);
        projectEnvironment.id = rawProjectEnvironment.id as string;
        projectEnvironment.key = rawProjectEnvironment.key as string;
        projectEnvironment.projectId = rawProjectEnvironment.project as string;
        projectEnvironment.codeSourceId = rawProjectEnvironment.code_source as string;
        projectEnvironment.parentId = rawProjectEnvironment.parent as string;
        projectEnvironment.defaultRunnerPoolId = rawProjectEnvironment.default_runner_pool as string | null;
        projectEnvironment.type = ProjectEnvironmentType.fromString(rawProjectEnvironment.type as string);
        projectEnvironment.state = State.fromString(rawProjectEnvironment.state as string);
        return projectEnvironment;
    }
}
