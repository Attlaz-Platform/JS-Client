import {Endpoint} from './Endpoint';
import {ProjectDeploy} from '../Model/Project/ProjectDeploy';
import {Utils} from '../Utils';
import {HttpClient} from '../Http/HttpClient';

export class ProjectDeployEndpoint extends Endpoint {

    public async getById(deployId: string): Promise<ProjectDeploy | null> {

        try {
            const rawProjectDeploy: any | null = await this.httpClient.request('/deploys/' + deployId);
            if (Utils.isNullOrUndefined(rawProjectDeploy)) {
                return null;
            }
            return ProjectDeploy.parse(rawProjectDeploy);

        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deploy by id', error);
            }

            throw error;
        }

    }

    public async getLatestDeploy(codeSourceId: string): Promise<ProjectDeploy | null> {

        try {
            const rawProjectDeploy: any | null = await this.httpClient.request('/codesources/' + codeSourceId + '/latestdeploy');
            if (Utils.isNullOrUndefined(rawProjectDeploy)) {
                return null;
            }
            return ProjectDeploy.parse(rawProjectDeploy);

        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load project deploy by id', error);
            }

            throw error;
        }

    }

    public async getByCodeSource(codeSourceId: string): Promise<ProjectDeploy[]> {

        try {
            const rawProjectDeploys: any[] = await this.httpClient.request('/codesources/' + codeSourceId + '/deploys');

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

    public async requestDeploy(codeSourceId: string): Promise<any> {

        try {
            const projectDeploy: any = await this.httpClient.request('/codesources/' + codeSourceId + '/deploys', {}, 'POST');
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
