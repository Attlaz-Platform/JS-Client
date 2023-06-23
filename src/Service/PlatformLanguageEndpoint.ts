import {Endpoint} from './Endpoint.js';
import {PlatformLanguage} from '../Model/Project/PlatformLanguage.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

export class PlatformLanguageEndpoint extends Endpoint {

    public async getAll(): Promise<CollectionResult<PlatformLanguage>> {
        const result: CollectionResult<PlatformLanguage> = await this.requestCollection('/platformlanguages', PlatformLanguage.parse);
        return result;
    }

}
