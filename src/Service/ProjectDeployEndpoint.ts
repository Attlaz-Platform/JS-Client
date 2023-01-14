import {Endpoint} from './Endpoint';
import {ProjectDeploy} from '../Model/Project/ProjectDeploy';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class ProjectDeployEndpoint extends Endpoint {

    public async getById(deployId: string): Promise<ProjectDeploy | null> {

        try {
            const rawProjectDeploy: ObjectResult<ProjectDeploy> = await this.requestObject('/deploys/' + deployId, null, ProjectDeploy.parse);
            return rawProjectDeploy.getData();

        } catch (error: any) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deploy by id', error);
            }

            throw error;
        }

    }

    public async getLatestDeploy(codeSourceId: string): Promise<ProjectDeploy | null> {

        try {
            const rawProjectDeploy: ObjectResult<ProjectDeploy> = await this.requestObject('/codesources/' + codeSourceId + '/latestdeploy', null, ProjectDeploy.parse);
            return rawProjectDeploy.getData();

        } catch (error: any) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deploy by id', error);
            }

            throw error;
        }

    }

    public async getByCodeSource(codeSourceId: string): Promise<CollectionResult<ProjectDeploy>> {

        try {
            const rawProjectDeploys: CollectionResult<ProjectDeploy> = await this.requestCollection('/codesources/' + codeSourceId + '/deploys', null, ProjectDeploy.parse);

            return rawProjectDeploys;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deploys', error);
            }

            throw error;
        }

    }

    public async requestDeploy(codeSourceId: string): Promise<any> {

        try {
            const projectDeploy: any = await this.request('/codesources/' + codeSourceId + '/deploys', {}, 'POST');
            // TODO: parse deploy
            return projectDeploy;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to request project deploy', error);
            }

            throw error;
        }

    }

}
