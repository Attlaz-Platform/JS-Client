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

    /**
     * Start watching an existing vendor as a competitor of this catalog.
     *
     * The vendor must already exist — create it with {@link VendorEndpoint.create} first. Re-adding
     * a previously removed competitor reactivates the original link, so its matches and price
     * history survive.
     *
     * Returns the link itself (`id`, `catalog`, `vendor`), not the populated competitor; read it
     * back with {@link getById} if you need the counts and timestamps.
     */
    public async add(catalogId: CatalogId | string, vendorId: string): Promise<CompetitorLink | null> {
        const result: ObjectResult<CompetitorLink> = await this.requestObject(
            path('/pulse/catalogs/:catalogId/competing-vendors', {catalogId: catalogId.toString()}),
            {vendor: vendorId},
            (raw): CompetitorLink => ({
                id: raw.id as string,
                catalogId: raw.catalog as string,
                vendorId: raw.vendor as string,
            }),
            'POST',
        );

        return result.getData();
    }

    /**
     * Stop watching a competitor.
     *
     * The vendor, its products and their price history are kept — only the catalog↔vendor link is
     * retired, so {@link add} can resume it later.
     */
    public async remove(catalogId: CatalogId | string, competitorId: string): Promise<void> {
        await this.requestObject(
            path('/pulse/catalogs/:catalogId/competing-vendors/:competitorId', {
                catalogId: catalogId.toString(),
                competitorId,
            }),
            null,
            (raw): unknown => raw,
            'DELETE',
        );
    }
}

/** The catalog↔vendor link row returned by {@link CompetitorEndpoint.add}. */
export type CompetitorLink = {
    id: string;
    catalogId: string;
    vendorId: string;
};
