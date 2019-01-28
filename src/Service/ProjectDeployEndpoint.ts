import {Endpoint, ProjectEnvironment} from "..";
import {ProjectDeploy} from '../Model/Project/ProjectDeploy';

export class ProjectDeployEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: number): Promise<ProjectDeploy[]> {

        try {
            const rawProjectDeployments: any[] = await this.httpClient.request('/projectenvironments/' + projectEnvironmentId + '/deploy');

            let projectDeployments: ProjectDeploy[] = [];
            for (let rawProjectDeployment of rawProjectDeployments) {
//TODO: add parsing
                projectDeployments.push(ProjectDeploy.parse(rawProjectDeployment));
            }
            return projectDeployments;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deployments', error);
            }

            throw error;
        }

    }

    public async requestDeploy(projectEnvironmentId: number): Promise<ProjectEnvironment> {

        try {
            const projectDeploy: any = await this.httpClient.request('/projectenvironments/' + projectEnvironmentId + '/deploy', {}, 'POST');

            return projectDeploy;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to request project deploy', error);
            }

            throw error;
        }

    }

}
