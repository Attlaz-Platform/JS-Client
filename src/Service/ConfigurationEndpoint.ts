import {QueryString} from '../Http/Data/QueryString.js';
import {Configuration} from '../Model/Configuration/Configuration.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class ConfigurationEndpoint extends Endpoint {
    public async getConfiguration(scopeId: string, path: string): Promise<Configuration | null> {
        try {

            const qs: QueryString = new QueryString('/configurations/' + scopeId);
            qs.set('path', path)

            const result: ObjectResult<Configuration> = await this.requestObject('/configurations/:scopeId', null, Configuration.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load flow configuration', error);
            }
            throw error;
        }
    }


}
