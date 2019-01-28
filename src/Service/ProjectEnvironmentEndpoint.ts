import {Endpoint, ProjectEnvironment} from "..";

export class ProjectEnvironmentEndpoint extends Endpoint {

    public async getByProject(id: string): Promise<ProjectEnvironment[]> {

        try {
            const rawProjectEnvironments: any[] = await this.httpClient.request('/projects/' + id + '/environments');

            let projectEnvironment: ProjectEnvironment[] = [];
            for (let rawProjectEnvironment of rawProjectEnvironments) {
//TODO: add parsing
                projectEnvironment.push(rawProjectEnvironment);
            }
            return projectEnvironment;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project environments', error);
            }

            throw error;
        }

    }

    public async getById(id: number): Promise<ProjectEnvironment> {

        try {
            const rawProjectEnvironments: any = await this.httpClient.request('/projectenvironments/' + id + '');

            const projectEnvironment: ProjectEnvironment = rawProjectEnvironments as ProjectEnvironment;
            return projectEnvironment;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project environment by id', error);
            }

            throw error;
        }

    }

}
