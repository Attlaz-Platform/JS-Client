import {QueryString} from '../Http/Data/QueryString.js';
import {Configuration} from '../Model/Configuration/Configuration.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Endpoint} from './Endpoint.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';

export class ConfigurationEndpoint extends Endpoint {
    public async getByPath(scopeId: string, path: string): Promise<Configuration | null> {
        try {

            const qs: QueryString = new QueryString('/configurations/' + scopeId);
            qs.set('path', path)

            const result: ObjectResult<Configuration> = await this.requestObject(qs, null, Configuration.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load configuration', error);
            }
            throw error;
        }
    }

    public async getByPathQuery(scopeId: string, pathQuery: string, pagination: CursorPagination): Promise<CollectionResult<Configuration>> {
        try {

            const qs: QueryString = new QueryString('/configurations/query/' + scopeId);
            qs.set('query', pathQuery);
            qs.addPagination(pagination);

            const result: CollectionResult<Configuration> = await this.requestCollection(qs, Configuration.parse);

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load configuration', error);
            }
            throw error;
        }
    }

}
