import {Endpoint} from './Endpoint.js';
import {WorkerConfig} from '../Model/Worker/WorkerConfig.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';

export class WorkerConfigEndpoint extends Endpoint {
    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<CollectionResult<WorkerConfig>> {
        try {
            const url: string = '/projectenvironments/' + projectEnvironmentId + '/workerconfiguration';

            const result: CollectionResult<WorkerConfig> = await this.requestCollection(url, WorkerConfig.parse);

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load worker config: ', error);
            }

            throw error;
        }
    }

    public async save(workerConfig: WorkerConfig): Promise<WorkerConfig> {
        try {
            const url: string = '/projectenvironments/' + workerConfig.projectEnvironmentId + '/workerconfiguration';

            const result: ObjectResult<WorkerConfig> = await this.requestObject(url, workerConfig, WorkerConfig.parse, 'POST');
            const createdWorkerConfig: WorkerConfig | null = result.getData();
            if (createdWorkerConfig === null) {
                throw new Error('WorkerConfig not created');
            }
            return createdWorkerConfig;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save worker config: ', error);
            }

            throw error;
        }
    }
}
