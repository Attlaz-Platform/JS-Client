import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {OpportunityType, ProductOpportunity} from '../Model/ProductOpportunity.js';

/** Narrowing of the worklist. `brand` is an exact match; `sku` matches a fragment. */
export type OpportunityFilters = {
    brand?: string;
    sku?: string;
};

/**
 * The pricing opportunity worklist — `/pulse/catalogs/:catalogId/opportunities`.
 */
export class OpportunityEndpoint extends Endpoint {

    /**
     * Opportunities in a catalog, ranked by money at stake.
     *
     * Pass a `type`: the score means something different per type, so an unfiltered read interleaves
     * four scales into one order. Unfiltered is an overview of what exists, not a ranked worklist.
     */
    public async getOpportunities(catalogId: CatalogId | string, pagination: CursorPagination | null = null, type: OpportunityType | null = null, filters: OpportunityFilters | null = null): Promise<CollectionResult<ProductOpportunity>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/opportunities', {catalogId: catalogId.toString()}));
        if (type !== null) {
            queryString.set('type', type);
        }
        if (filters?.brand !== undefined) {
            queryString.set('brand', filters.brand);
        }
        if (filters?.sku !== undefined) {
            queryString.set('sku', filters.sku);
        }
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, ProductOpportunity.parse);
    }
}
