import {Endpoint} from './Endpoint.js';
import {Worker} from '../Model/Worker/Worker.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';

export class WorkerEndpoint extends Endpoint {
    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<Worker | null> {
        try {
            const url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const result: ObjectResult<Worker> = await this.requestObject(url, null, Worker.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }
    }

    public async update(projectEnvironmentId: string): Promise<boolean> {
        try {
            const url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const parser = (input: any): { updated: boolean } => ({updated: input.updated});
            const result: ObjectResult<{ updated: boolean }> = await this.requestObject(url, null, parser, 'POST');

            const isUpdated: { updated: boolean } | null = result.getData();
            if (isUpdated === null) {
                throw new Error('Worker probably not updated');
            }
            return isUpdated.updated;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to update worker: ', error);
            }

            throw error;
        }
    }
}
