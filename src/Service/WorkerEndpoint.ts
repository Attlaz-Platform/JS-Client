import {Endpoint} from './Endpoint';
import {Utils} from '../Utils';
import {Worker} from '../Model/Worker/Worker';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class WorkerEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<Worker | null> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

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

            let url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const parser = (input: any): { updated: boolean } => {
                return {updated: input.updated};
            }
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
