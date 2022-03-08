import {Endpoint} from './Endpoint';
import {ProjectDeploy} from '../Model/Project/ProjectDeploy';
import {Utils} from '../Utils';

export class ProjectDeployEndpoint extends Endpoint {

    public async getById(deployId: number): Promise<ProjectDeploy > {

        try {
            const rawProjectDeploy: any = await this.httpClient.request('/deploys/' + deployId);
            if (Utils.isNullOrUndefined(rawProjectDeploy)) {
              throw new Error('Unable to get deploy');
            }
            return ProjectDeploy.parse(rawProjectDeploy);

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deploy by id', error);
            }

            throw error;
        }

    }

    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<ProjectDeploy[]> {

        try {
            const rawProjectDeploys: any[] = await this.httpClient.request('/projectenvironments/' + projectEnvironmentId + '/deploys');

            let projectDeploys: ProjectDeploy[] = [];
            for (let rawProjectDeploy of rawProjectDeploys) {
                projectDeploys.push(ProjectDeploy.parse(rawProjectDeploy));
            }
            return projectDeploys;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deploys', error);
            }

            throw error;
        }

    }

    public async requestDeploy(projectEnvironmentId: string): Promise<any> {

        try {
            const projectDeploy: any = await this.httpClient.request('/projectenvironments/' + projectEnvironmentId + '/deploys', {}, 'POST');
            // TODO: parse deploy
            console.log('Parse deploy', projectDeploy);
            return projectDeploy;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to request project deploy', error);
            }

            throw error;
        }

    }

}
