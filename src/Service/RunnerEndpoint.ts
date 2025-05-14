import {Endpoint} from './Endpoint.js';
import {RunnerImage} from '../Model/Runner/RunnerImage.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Utils} from '../Utils.js';
import {State} from '../Model/State.js';

export class RunnerEndpoint extends Endpoint {
    

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
