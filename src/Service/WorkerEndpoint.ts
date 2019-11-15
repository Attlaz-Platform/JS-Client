import {Endpoint} from "..";
import {Worker} from '../Model/Worker';

export class WorkerEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: number): Promise<Worker> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const result: any = await this.httpClient.request(url);

            const worker: Worker = new Worker();
            worker.projectEnvironment = result.projectEnvironment;
            worker.active = result.active;
            worker.scale = result.scale;
            worker.image = result.image;

            return worker;

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
}
