import {Endpoint} from './Endpoint';
import {Project} from '../Model/Project/Project';
import {Utils} from '../Utils';
import {DataResult} from '../Model/Result/DataResult';
import {HttpClient} from '../Http/HttpClient';

export class ProjectEndpoint extends Endpoint {

    public async getAll(): Promise<Project[]> {
        try {
            const result: DataResult<Project[]> = await this.request('/projects');
            result.setData(this.parseCollection(result, Project.parse));
            return result.getData();
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load projects: ' + e);
            }
            throw e;
        }

    }

    public async getByTeam(teamId: string): Promise<Project[]> {
        try {
            const result: DataResult<Project[]> = await this.request('teams/' + teamId + '/projects');
            result.setData(this.parseCollection(result, Project.parse));
            return result.getData();
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

    public save(project: Project): Promise<Project> {
        return new Promise<any>((resolve, reject) => {

            this.httpClient.request('projects/', project, 'POST').then((rawProject: any) => {

                resolve(Project.parse(rawProject));

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save project: ', reason);
                }
                reject(reason);
            });

        });
    }
}
