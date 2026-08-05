import {path} from '../../Http/Data/Path.js';
import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {Competitor} from '../Model/Competitor.js';

/**
 * The competitors a catalog is watched against — `/pulse/catalogs/:catalogId/competing-vendors`
 * for the catalog's list, `/pulse/competing-vendors/:competitorId` for one.
 */
export class CompetitorEndpoint extends Endpoint {

    public async getByCatalog(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<Competitor>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/competing-vendors', {catalogId: catalogId.toString()}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, Competitor.parse);
    }

    public async getById(competitorId: string): Promise<Competitor | null> {
        const result: ObjectResult<Competitor> = await this.requestObject(
            path('/pulse/competing-vendors/:competitorId', {competitorId}),
            null,
            Competitor.parse,
            'GET',
        );

        return result.getData();
    }

    /** Start watching a vendor as a competitor of this catalog. */
    public async add(catalogId: CatalogId | string, vendorId: string): Promise<Competitor | null> {
        const result: ObjectResult<Competitor> = await this.requestObject(
            path('/pulse/catalogs/:catalogId/competing-vendors', {catalogId: catalogId.toString()}),
            {vendor: vendorId},
            Competitor.parse,
            'POST',
        );

        return result.getData();
    }
}
