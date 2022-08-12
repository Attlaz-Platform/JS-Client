import {Endpoint} from './Endpoint';
import {PlatformLanguage} from '../Model/Project/PlatformLanguage';
import {DataResult} from '../Model/Result/DataResult';

export class PlatformLanguageEndpoint extends Endpoint {

    public async getAll(): Promise<DataResult<PlatformLanguage[]>> {
        let cmd: string = '/platformlanguages';
        const result: DataResult<PlatformLanguage[]> = await this.request(cmd);
        result.setData(this.parseCollection(result, PlatformLanguage.parse));
        return result;
    }

}
