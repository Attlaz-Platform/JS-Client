import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {SearchResult} from '../Model/Search/SearchResult.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class SearchEndpoint extends Endpoint {
    public async search(query: string): Promise<CollectionResult<SearchResult>> {
        if (query.length > 512) {
            query = query.substring(0, 512);
        }
        const qs: QueryString = new QueryString('search');
        qs.set('q', query);
        const result: CollectionResult<SearchResult> = await this.requestCollection(qs, SearchResult.parse);
        return result;
    }
}
