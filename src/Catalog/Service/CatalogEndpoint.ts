import {QueryString} from '../../Http/Data/QueryString.js';
import {Catalog} from '../Model/Catalog.js';
import {CatalogId} from '../Model/CatalogId.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

/**
 * Catalogs — `/catalogs`. The catalog-scoped operations of an individual app (products, matching,
 * feeds, quality) live with that app; this endpoint is the catalogs themselves.
 */
export class CatalogEndpoint extends Endpoint {

    /** The project's catalogs. */
    public async getByProject(projectId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<Catalog>> {
        const queryString: QueryString = new QueryString('/catalogs');
        queryString.set('project', projectId);
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, Catalog.parse);
    }

    /** The catalog with this id, or null. */
    public async getById(catalogId: CatalogId | string): Promise<Catalog | null> {
        const result: ObjectResult<Catalog> = await this.requestObject(
            '/catalogs/' + catalogId.toString(),
            null,
            Catalog.parse,
            'GET',
        );

        return result.getData();
    }
}
