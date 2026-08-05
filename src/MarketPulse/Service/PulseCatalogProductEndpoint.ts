import {path} from '../../Http/Data/Path.js';
import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {FilterNode} from '../../Model/Filter/FilterNode.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {CatalogProductWithMatches} from '../Model/CatalogProductWithMatches.js';
import {PulseCatalogProductFilterOptions} from '../Model/PulseCatalogProductFilterOptions.js';
import {PulseCatalogProductFilters} from '../Model/PulseCatalogProductFilters.js';

/**
 * A catalog's own products as Market Pulse sees them — with the competitor products matched to
 * each. `/pulse/catalogs/:catalogId/products`.
 */
export class PulseCatalogProductEndpoint extends Endpoint {

    /**
     * The catalog's products, each with its matches expanded.
     *
     * `filters` covers the common narrowing; `filter` takes a structured {@link FilterNode} for
     * anything the simple filters cannot express.
     */
    public async getProducts(
        catalogId: CatalogId | string,
        pagination: CursorPagination | null = null,
        filters: PulseCatalogProductFilters = {},
        filter: FilterNode | null = null,
    ): Promise<CollectionResult<CatalogProductWithMatches>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/products', {catalogId: catalogId.toString()}));
        queryString.set('expand', ['matches.vendor']);
        if (filters.brand) {
            queryString.set('brand', filters.brand);
        }
        if (filters.category) {
            queryString.set('category', filters.category);
        }
        if (filters.search) {
            queryString.set('search', filters.search);
        }
        if (filters.productGroup) {
            queryString.set('product_group', filters.productGroup);
        }
        if (filters.tags) {
            for (const [key, value] of Object.entries(filters.tags)) {
                queryString.set('tag[' + key + ']', value);
            }
        }
        if (filter !== null) {
            queryString.set('filter', JSON.stringify(filter));
        }
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, CatalogProductWithMatches.parse);
    }

    public async getFilterOptions(catalogId: CatalogId | string): Promise<PulseCatalogProductFilterOptions> {
        const result: ObjectResult<PulseCatalogProductFilterOptions> = await this.requestObject(
            path('/pulse/catalogs/:catalogId/filter-options', {catalogId: catalogId.toString()}),
            null,
            (raw: Record<string, unknown>): PulseCatalogProductFilterOptions => ({
                brands: (raw.brands as string[] | undefined) ?? [],
                categories: (raw.categories as string[] | undefined) ?? [],
                productGroups: (raw.product_groups as {id: string; name: string}[] | undefined) ?? [],
                tags: (raw.tags as Record<string, string[]> | undefined) ?? {},
            }),
            'GET',
        );

        return result.getData() ?? {brands: [], categories: [], productGroups: [], tags: {}};
    }

    /** Recalculate the catalog's cached statistics (price index, match counts, segments). */
    public async recomputeStatistics(catalogId: CatalogId | string): Promise<void> {
        await this.requestObject(
            path('/pulse/catalogs/:catalogId/recompute-stats', {catalogId: catalogId.toString()}),
            {},
            (raw: unknown): unknown => raw,
            'POST',
        );
    }
}
