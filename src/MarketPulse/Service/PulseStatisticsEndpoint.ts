import {path} from '../../Http/Data/Path.js';
import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {MarketPositionSummary} from '../Model/MarketPositionSummary.js';
import {MarketSummaryEntry} from '../Model/MarketSummaryEntry.js';
import {PriceIndexSnapshotEntry} from '../Model/PriceIndexSnapshotEntry.js';
import {ProductSegmentType} from '../Model/ProductSegmentType.js';
import {ProductsSegment} from '../Model/ProductsSegment.js';
import {TopCompetitor} from '../Model/TopCompetitor.js';

/**
 * Aggregated Market Pulse figures for a catalog — `/pulse/catalogs/:catalogId/statistics/*`.
 * These are precomputed server-side; `CatalogProductEndpoint.recomputeStatistics` refreshes them.
 */
export class PulseStatisticsEndpoint extends Endpoint {

    /** The catalog against the market: coverage, where the compared products stand, and the price date. */
    public async getMarketPositionSummary(catalogId: CatalogId | string): Promise<MarketPositionSummary> {
        const result: ObjectResult<MarketPositionSummary> = await this.requestObject(
            path('/pulse/catalogs/:catalogId/market-positions/summary', {catalogId: catalogId.toString()}),
            null,
            MarketPositionSummary.parse,
            'GET',
        );

        return result.getData() ?? new MarketPositionSummary();
    }

    /** Headline figures (products tracked, matches, competitors …) against the previous period. */
    public async getAccountSummary(catalogId: CatalogId | string): Promise<CollectionResult<MarketSummaryEntry>> {
        return await this.requestCollection(
            path('/pulse/catalogs/:catalogId/statistics/account-summary', {catalogId: catalogId.toString()}),
            (raw: Record<string, unknown>): MarketSummaryEntry => ({
                id: raw.id as string,
                title: raw.title as string,
                currentAmount: (raw.current_amount as number | undefined) ?? 0,
                previousAmount: (raw.previous_amount as number | undefined) ?? 0,
            }),
        );
    }

    /** Distribution of the catalog's products across price or profit segments. */
    public async getProductSegments(catalogId: CatalogId | string, type: ProductSegmentType | null = null): Promise<CollectionResult<ProductsSegment>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/statistics/product-segments', {catalogId: catalogId.toString()}));
        if (type !== null) {
            queryString.set('type', type);
        }

        return await this.requestCollection(
            queryString,
            (raw: Record<string, unknown>): ProductsSegment => ({
                code: raw.code as string,
                current: (raw.current as number | undefined) ?? 0,
                previous: (raw.previous as number | undefined) ?? 0,
            }),
        );
    }

    /**
     * The competitors with the most matches against this catalog. `period` is the number of days
     * the comparison against the previous period spans.
     */
    public async getTopCompetitors(catalogId: CatalogId | string, limit: number | null = null, period: number | null = null): Promise<CollectionResult<TopCompetitor>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/statistics/top-competitors', {catalogId: catalogId.toString()}));
        if (limit !== null) {
            queryString.set('limit', limit);
        }
        if (period !== null) {
            queryString.set('period', period);
        }

        return await this.requestCollection(queryString, TopCompetitor.parse);
    }

    /**
     * Price index per competitor over time, for charting. Pass the competitors to include, and
     * optionally a product group to scope to and a date range (`YYYY-MM-DD`).
     */
    public async getPriceIndexHistory(
        catalogId: CatalogId | string,
        competitorIds: string[] = [],
        options: {group?: string; from?: string; to?: string} = {},
    ): Promise<CollectionResult<PriceIndexSnapshotEntry>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/statistics/price-index-history', {catalogId: catalogId.toString()}));
        if (competitorIds.length > 0) {
            queryString.set('competitor', competitorIds.join(','));
        }
        if (options.group) {
            queryString.set('group', options.group);
        }
        if (options.from) {
            queryString.set('from', options.from);
        }
        if (options.to) {
            queryString.set('to', options.to);
        }

        return await this.requestCollection(queryString, PriceIndexSnapshotEntry.parse);
    }
}
