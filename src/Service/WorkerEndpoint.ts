import {Endpoint} from './Endpoint';
import {Utils} from '../Utils';
import {Worker} from '../Model/Worker/Worker';
import {DataResult} from '../Model/Result/DataResult';
import {Platform} from '../Model/Worker/Platform';

// import {DataResult, Worker, Platform} from '..';

export class WorkerEndpoint extends Endpoint {

    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<Worker> {

        try {
            let url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const result: any = await this.httpClient.request(url);
            if (Utils.isNullOrUndefined(result)) {
                throw new Error('Unable to find worker')
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

    public async getPlatforms(): Promise<Platform[]> {

        let cmd: string = '/platforms';

        const rawPlatforms: any[] = await this.httpClient.request(cmd);

        const result: Platform[] = [];
        for (let rawPlatform of rawPlatforms) {
            result.push(Platform.parse(rawPlatform));
        }
        return result;

    }
}
