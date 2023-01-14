import {Endpoint} from './Endpoint';
import {Project} from '../Model/Project/Project';
import {Utils} from '../Utils';
import {HttpClient} from '../Http/HttpClient';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class ProjectEndpoint extends Endpoint {

    public async getAll(): Promise<CollectionResult<Project>> {
        try {
            const result: CollectionResult<Project> = await this.requestCollection('/projects', null, Project.parse);
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load projects: ' + e);
            }
            throw e;
        }

    }

    public async getByTeam(teamId: string): Promise<CollectionResult<Project>> {
        try {
            const result: CollectionResult<Project> = await this.requestCollection('teams/' + teamId + '/projects', null, Project.parse);
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
            const rawProject: any = await this.httpClient.request('projects/' + projectId + '');
            if (Utils.isNullOrUndefined(rawProject)) {
                return null;
            }
            return Project.parse(rawProject);
        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project by id: ' + error);
            }
            throw error;
        }

    }

    public async save(project: Project): Promise<Project> {

        try {

            let url: string = '/projects';
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
