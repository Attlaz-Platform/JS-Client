import {Endpoint} from './Endpoint';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {SearchResult} from '../Model/Search/SearchResult';

export class SearchEndpoint extends Endpoint {

    public async search(query: string): Promise<CollectionResult<SearchResult>> {

        if (query.length > 512) {
            query = query.substring(0, 512);
        }

        let cmd: string = 'search?q=' + query;
        const result: CollectionResult<SearchResult> = await this.requestCollection(cmd, SearchResult.parse);
        return result;
    }
}
