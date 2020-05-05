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
            const rawProjectEnvironment: any = await this.httpClient.request('/projectenvironments/' + id + '');

            const projectEnvironment: ProjectEnvironment = rawProjectEnvironment as ProjectEnvironment;
            return projectEnvironment;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project environment by id', error);
            }

            throw error;
        }

    }

    public async save(projectEnvironment: ProjectEnvironment): Promise<ProjectEnvironment> {

        try {
            const rawProjectEnvironment: any = await this.httpClient.request('projectenvironments/', projectEnvironment, 'POST');

            // TODO: parse result
            const savedProjectEnvironment: ProjectEnvironment = rawProjectEnvironment as ProjectEnvironment;
            return savedProjectEnvironment;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save project environment', error, projectEnvironment);
            }

            throw error;
        }
    }
}
