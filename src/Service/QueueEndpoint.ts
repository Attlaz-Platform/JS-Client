import {Endpoint} from './Endpoint';
import {Utils} from '../Utils';
import {DataResult} from '../Model/Result/DataResult';
import {QueueStatus} from '../Model/Queue/QueueStatus';


export class QueueEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<DataResult<QueueStatus>> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/queues';

            const result: DataResult<QueueStatus> = await this.request(url);
            if (Utils.isNullOrUndefined(result)) {
                return null;
            }

            result.setData(QueueStatus.parse(result.getData()));
            return result;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }

    }

}
