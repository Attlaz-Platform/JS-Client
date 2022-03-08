import {Endpoint} from './Endpoint';
import {DataResult} from '../Model/Result/DataResult';
import {Utils} from '../Utils';
import {WorkerConfig} from '../Model/Worker/WorkerConfig';

export class WorkerConfigEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<WorkerConfig[] > {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/workerconfiguration';

            const result: DataResult<any[]> = await this.request(url);

            if (Utils.isNullOrUndefined(result)) {
                throw new Error('Unable to get project environment');
            }
            const resultData: any | null = result.getData();
            if (resultData === null) {
                throw new Error('Unable to get project environment');
            }
            let workerConfigValues: WorkerConfig[] = [];
            for (let rawConfig of resultData) {

                workerConfigValues.push(WorkerConfig.parse(rawConfig));
            }
            return workerConfigValues;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load worker config: ', error);
            }

            throw error;
        }

    }

    public async save(workerConfig: WorkerConfig): Promise<WorkerConfig> {

        try {

            let url: string = '/projectenvironments/' + workerConfig.projectEnvironment + '/workerconfiguration';

            const result: DataResult<any> = await this.request(url, workerConfig, 'POST');
            console.log(result);
            return WorkerConfig.parse(result);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save worker config: ', error);
            }

            throw error;
        }

    }

}
