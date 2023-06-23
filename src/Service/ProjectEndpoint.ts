import {Endpoint} from './Endpoint.js';
import {Project} from '../Model/Project/Project.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {State} from '../Model/State.js';

export class ProjectEndpoint extends Endpoint {
    public async getAll(): Promise<CollectionResult<Project>> {
        try {
            const result: CollectionResult<Project> = await this.requestCollection('/projects', Project.parse);
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load projects: ' + e);
            }
            throw e;
        }
    }

    public async getByWorkspace(workspaceId: string, states: State[] | null = null): Promise<CollectionResult<Project>> {
        try {
            const queryString: QueryString = new QueryString();
            if (states !== null) {
                queryString.set('state', states);
            }
            const result: CollectionResult<Project> = await this.requestCollection('workspaces/' + workspaceId + '/projects' + queryString.build(), Project.parse);
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load projects: ' + e);
            }
            throw e;
        }
    }

    public async getById(projectId: string): Promise<Project | null> {
        try {
            const result: ObjectResult<Project> = await this.requestObject('projects/' + projectId + '', null, Project.parse);
            return result.getData();
        } catch (error: any) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project by id: ' + error);
            }
            throw error;
        }
    }

    public async save(project: Project): Promise<Project> {
        try {
            const url: string = '/projects';
            const result: ObjectResult<Project> = await this.requestObject(url, project, Project.parse, 'POST');
            const updatedProject: Project | null = result.getData();
            if (updatedProject === null) {
                throw new Error('Project not updated');
            }
            return updatedProject;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save project: ', error);
            }
            throw error;
        }
    }
}
