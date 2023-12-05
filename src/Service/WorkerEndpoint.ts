import {Endpoint} from './Endpoint.js';
import {Worker} from '../Model/Worker/Worker.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {RunnerImage} from '../Model/Runner/RunnerImage.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Utils} from '../Utils.js';
import {State} from '../Model/State.js';

export class WorkerEndpoint extends Endpoint {
    public async getByProjectEnvironment(projectEnvironmentId: string): Promise<Worker | null> {
        try {
            const url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

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
            const url: string = '/projectenvironments/' + projectEnvironmentId + '/workers';

            const parser = (input: any): { updated: boolean } => ({updated: input.updated});
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

    public async getImages(): Promise<CollectionResult<RunnerImage>> {
        const url: string = '/runners/images';

        const parser = (rawImage: any): RunnerImage => {
            const runnerImage: RunnerImage = new RunnerImage();
            runnerImage.id = rawImage.id;
            runnerImage.name = rawImage.name;
            runnerImage.image = rawImage.image;
            runnerImage.version = rawImage.image;
            runnerImage.buildDate = Utils.parseRawDate(rawImage.build_date);
            runnerImage.deprecated = Utils.isTrue(rawImage.deprecated);

            if (rawImage.end_of_support !== null && rawImage.end_of_support !== undefined) {
                runnerImage.endOfSupport = Utils.parseRawDate(rawImage.end_of_support);
            }

            if (rawImage.end_of_life !== null && rawImage.end_of_life !== undefined) {
                runnerImage.endOfLife = Utils.parseRawDate(rawImage.end_of_life);
            }

            runnerImage.state = State.fromString(rawImage.state);

            return runnerImage;
        };
        const result: CollectionResult<RunnerImage> = await this.requestCollection(url, parser);

        return result;
    }
}
