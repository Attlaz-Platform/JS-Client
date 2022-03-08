import {Endpoint} from './Endpoint';
import {Project} from '../Model/Project/Project';
import {Utils} from '../Utils';

export class ProjectEndpoint extends Endpoint {

    public getAll(): Promise<Project[]> {
        return new Promise<Project[]>((resolve, reject) => {
            this.httpClient.request('projects').then((rawProjects: any) => {

                let projects: Project[] = [];
                for (let rawProject of rawProjects) {
                    projects.push(Project.parse(rawProject));
                }

                resolve(projects);
            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load projects: ' + reason);
                }

                reject(reason);
            });
        });

    }

    public getByTeam(teamId: string): Promise<Project[]> {
        return new Promise<Project[]>((resolve, reject) => {
            this.httpClient.request('teams/' + teamId + '/projects').then((rawProjects: any) => {

                let projects: Project[] = [];
                for (let rawProject of rawProjects) {
                    projects.push(Project.parse(rawProject));
                }

                resolve(projects);
            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load projects: ' + reason);
                }

                reject(reason);
            });
        });

    }

    public async getById(projectId: string): Promise<Project> {

        try {
            const rawProject: any = await this.httpClient.request('projects/' + projectId + '');
            if (Utils.isNullOrUndefined(rawProject)) {
                throw new Error('Unable to get project');
            }
            return Project.parse(rawProject);
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project by id: ' + e);
            }
            throw e;
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
