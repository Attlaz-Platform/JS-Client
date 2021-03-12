import {Endpoint} from './Endpoint';
import {Utils} from '../Utils';
import {DataResult, Worker, WorkerImage} from '..';

export class WorkerEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<Worker> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const result: any = await this.httpClient.request(url);
            if (Utils.isNullOrUndefined(result)) {
                return null;
            }

            return Worker.parse(result);

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }

    }

    public async update(projectEnvironmentId: string): Promise<DataResult<boolean>> {

        try {

            let url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const result: DataResult<boolean> = await this.request(url, null, 'POST');

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to update worker: ', error);
            }

            throw error;
        }

    }

    public async getWorkerImages(): Promise<WorkerImage[]> {

        let cmd: string = '/workerimages';

        const rawWorkerImages: any[] = await this.httpClient.request(cmd);

        const result: WorkerImage[] = [];
        for (let rawWorkerImage of rawWorkerImages) {
            result.push(WorkerImage.parse(rawWorkerImage));
        }
        return result;

    }
}
