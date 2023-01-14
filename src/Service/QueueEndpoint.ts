import {Endpoint} from './Endpoint';
import {QueueStatus} from '../Model/Queue/QueueStatus';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class QueueEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<QueueStatus | null> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/queues';

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
