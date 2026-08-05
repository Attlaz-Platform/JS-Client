import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {IndexJob} from '../Model/IndexJob.js';
import {VendorStatus} from '../Model/VendorStatus.js';

/**
 * Market Pulse index jobs — building the embeddings a competitor's products must have before they
 * can be matched — and the resulting per-vendor freshness status.
 */
export class IndexJobEndpoint extends Endpoint {

    /** Index jobs across every competitor of a catalog, newest first. */
    public async getByCatalog(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<IndexJob>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/index-jobs', {catalogId: catalogId.toString()}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, IndexJob.parse);
    }

    /** Index jobs of one competitor. */
    public async getByVendor(catalogId: CatalogId | string, vendorId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<IndexJob>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/vendors/:vendorId/index-jobs', {catalogId: catalogId.toString(), vendorId}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, IndexJob.parse);
    }

    /** Queue a re-index of a competitor's products, so later matching sees current data. */
    public async requestReindex(catalogId: CatalogId | string, vendorId: string): Promise<void> {
        await this.requestObject(
            path('/pulse/catalogs/:catalogId/vendors/:vendorId/reindex', {catalogId: catalogId.toString(), vendorId}),
            {},
            (raw: unknown): unknown => raw,
            'POST',
        );
    }

    /** How fresh a competitor's index and matches are, plus any match job running right now. */
    public async getVendorStatus(catalogId: CatalogId | string, vendorId: string): Promise<VendorStatus | null> {
        const result: ObjectResult<VendorStatus> = await this.requestObject(
            path('/pulse/catalogs/:catalogId/vendors/:vendorId/status', {catalogId: catalogId.toString(), vendorId}),
            null,
            VendorStatus.parse,
            'GET',
        );

        return result.getData();
    }
}
