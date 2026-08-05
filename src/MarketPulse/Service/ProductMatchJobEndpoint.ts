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

    /** Every match job of a catalog, newest first. */
    public async getByCatalog(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<ProductMatchJob>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/match-jobs', {catalogId: catalogId.toString()}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, ProductMatchJob.parse);
    }

    /** The match jobs of one of the catalog's competitors. */
    public async getByVendor(catalogId: CatalogId | string, vendorId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<ProductMatchJob>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/vendors/:vendorId/match-jobs', {catalogId: catalogId.toString(), vendorId}));
        queryString.addPagination(pagination);

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
