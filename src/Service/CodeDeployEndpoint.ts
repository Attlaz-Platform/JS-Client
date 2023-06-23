import {Endpoint} from './Endpoint';
import {CodeDeploy} from '../Model/Project/CodeDeploy';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class CodeDeployEndpoint extends Endpoint {

    public async getById(deployId: string): Promise<CodeDeploy | null> {

        try {
            const rawDeploy: ObjectResult<CodeDeploy> = await this.requestObject('/deploys/' + deployId, null, CodeDeploy.parse);
            return rawDeploy.getData();

        } catch (error: any) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load deploy by id', error);
            }

            throw error;
        }

    }

    public async getLatestDeploy(codeSourceId: string): Promise<CodeDeploy | null> {

        try {
            const rawDeploy: ObjectResult<CodeDeploy> = await this.requestObject('/codesources/' + codeSourceId + '/latestdeploy', null, CodeDeploy.parse);
            return rawDeploy.getData();

        } catch (error: any) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load latest deploy by code source', error);
            }

            throw error;
        }

    }

    public async getByCodeSource(codeSourceId: string): Promise<CollectionResult<CodeDeploy>> {

        try {
            const rawDeploys: CollectionResult<CodeDeploy> = await this.requestCollection('/codesources/' + codeSourceId + '/deploys', CodeDeploy.parse);

            return rawDeploys;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load deploys by code source', error);
            }

            throw error;
        }

    }

    public async requestDeploy(codeSourceId: string): Promise<CodeDeploy> {

        try {
            const result: ObjectResult<CodeDeploy> = await this.requestObject('/codesources/' + codeSourceId + '/deploys', null, CodeDeploy.parse, 'POST');
            const requestedDeploy: CodeDeploy | null = result.getData();
            if (requestedDeploy === null) {
                throw new Error('Deploy not requested');
            }
            return requestedDeploy;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to request deploy', error);
            }

            throw error;
        }

    }

}
