import {Endpoint, Utils, Worker} from "..";
import {WorkerImage} from '../Model/Worker/WorkerImage';

export class WorkerEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: number): Promise<Worker> {

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

    public async save(worker: Worker): Promise<boolean> {

        try {

            let url: string = '/projectenvironments/' + worker.projectEnvironment + '/workers';

            const result: any = await this.httpClient.request(url, worker, 'POST');

            return true
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save trigger: ', error);
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
