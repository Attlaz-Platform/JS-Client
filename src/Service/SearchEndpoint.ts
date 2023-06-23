import {Endpoint} from './Endpoint.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {SearchResult} from '../Model/Search/SearchResult.js';

export class SearchEndpoint extends Endpoint {
    public async search(query: string): Promise<CollectionResult<SearchResult>> {
        if (query.length > 512) {
            query = query.substring(0, 512);
        }

        const cmd: string = 'search?q=' + query;
        const result: CollectionResult<SearchResult> = await this.requestCollection(cmd, SearchResult.parse);
        return result;
    }
}
