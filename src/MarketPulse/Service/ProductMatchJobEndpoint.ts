import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {ProductMatchJob} from '../Model/ProductMatchJob.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

/**
 * Market Pulse product match jobs — `/pulse/match-jobs`. All three routes return the same shape,
 * so they share {@link ProductMatchJob}.
 */
export class ProductMatchJobEndpoint extends Endpoint {

    /**
     * Every match job of a catalog, newest first. Pass `vendorIds` to narrow to one or more of
     * its competitors; a vendor outside this catalog is rejected.
     */
    public async getByCatalog(
        catalogId: CatalogId | string,
        pagination: CursorPagination | null = null,
        vendorIds: string[] | null = null,
    ): Promise<CollectionResult<ProductMatchJob>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/match-jobs', {catalogId: catalogId.toString()}));
        queryString.addPagination(pagination);
        if (vendorIds !== null && vendorIds.length > 0) {
            // Repeated param (`vendor=a&vendor=b`) — QueryString expands arrays, and the API reads it
            // with getOptionalCollection.
            queryString.set('vendor', vendorIds);
        }

        return await this.requestCollection(queryString, ProductMatchJob.parse);
    }

    /** Queue a matching run of the catalog against one competitor. */
    public async requestMatching(catalogId: CatalogId | string, vendorId: string): Promise<void> {
        await this.requestObject(
            path('/pulse/catalogs/:catalogId/vendors/:vendorId/match', {catalogId: catalogId.toString(), vendorId}),
            {},
            (raw: unknown): unknown => raw,
            'POST',
        );
    }

    /** The match job with this id, or null. */
    public async getById(productMatchJobId: string): Promise<ProductMatchJob | null> {
        const result: ObjectResult<ProductMatchJob> = await this.requestObject(
            path('/pulse/match-jobs/:productMatchJobId', {productMatchJobId}),
            null,
            ProductMatchJob.parse,
            'GET',
        );

        return result.getData();
    }
}
