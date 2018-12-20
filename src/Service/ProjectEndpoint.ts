import {Endpoint, Project} from "..";

export class ProjectEndpoint extends Endpoint {

    public getAll(): Promise<Project[]> {
        return new Promise<Project[]>((resolve, reject) => {
            this.httpClient.request('projects').then((rawProjects: any) => {

                let projects: Project[] = [];
                for (let rawProject of rawProjects) {
                    projects.push(Project.parse(rawProject));
                }

                resolve(projects);
            }).catch((reason) => {
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
            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load projects: ' + reason);
                }

                reject(reason);
            });
        });

    }
}