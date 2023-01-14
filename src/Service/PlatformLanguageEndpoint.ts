import {Endpoint} from './Endpoint';
import {PlatformLanguage} from '../Model/Project/PlatformLanguage';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class PlatformLanguageEndpoint extends Endpoint {

    public async getAll(): Promise<CollectionResult<PlatformLanguage>> {
        const result: CollectionResult<PlatformLanguage> = await this.requestCollection('/platformlanguages', null, PlatformLanguage.parse);
        return result;
    }

}
