import {Endpoint} from './Endpoint.js';
import {QueueStatus} from '../Model/Queue/QueueStatus.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';

export class QueueEndpoint extends Endpoint {
    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<QueueStatus | null> {
        try {
            const url: string = '/projectenvironments/' + projectEnvironmentId + '/queues';

            const result: ObjectResult<QueueStatus> = await this.requestObject(url, null, QueueStatus.parse);
            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }
    }
}
