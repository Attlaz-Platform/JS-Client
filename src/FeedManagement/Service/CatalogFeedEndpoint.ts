import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {CatalogFeed} from '../Model/CatalogFeed.js';

/**
 * Feeds of a catalog — `/catalogs/:catalogId/feeds`.
 *
 * `expand` accepts `source`, `source.source`, `destination` and `destination.adapter`; without it
 * the feed carries only the ids.
 */
export class CatalogFeedEndpoint extends Endpoint {

    public async getByCatalog(
        catalogId: CatalogId | string,
        pagination: CursorPagination | null = null,
        expand: string[] = [],
    ): Promise<CollectionResult<CatalogFeed>> {
        const queryString: QueryString = new QueryString(path('/catalogs/:catalogId/feeds', {catalogId: catalogId.toString()}));
        if (expand.length > 0) {
            queryString.set('expand', expand);
        }
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, CatalogFeed.parse);
    }
}
