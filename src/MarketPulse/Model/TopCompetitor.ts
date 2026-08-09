import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A competitor in the "top competitors" ranking of a catalog — the
 * `/pulse/catalogs/:catalogId/statistics/top-competitors` resource.
 *
 * A denormalised read model: it carries the vendor's display fields so a leaderboard renders from
 * one request, and the previous price index so the trend can be shown without a second series.
 */
export class TopCompetitor {
    public competitorId: string;
    public vendorId: string;
    public vendorName: string = '';
    public vendorUrl: string = '';
    public vendorIcon: string | null = null;
    public matchCount: number = 0;
    public productCount: number = 0;
    public priceIndex: number | null = null;
    public previousPriceIndex: number | null = null;

    public constructor(competitorId: string, vendorId: string) {
        this.competitorId = competitorId;
        this.vendorId = vendorId;
    }

    /** Alias of {@link competitorId}: collection helpers key rows on `id`. */
    public get id(): string {
        return this.competitorId;
    }

    public static parse(raw: ApiRecord): TopCompetitor {
        const competitor: TopCompetitor = new TopCompetitor(raw.competitor as string, raw.vendor as string);
        competitor.vendorName = (raw.vendor_name as string | undefined) ?? '';
        competitor.vendorUrl = (raw.vendor_url as string | undefined) ?? '';
        competitor.vendorIcon = (raw.vendor_icon as string | undefined) ?? null;
        competitor.matchCount = Number(raw.match_count ?? 0);
        competitor.productCount = Number(raw.product_count ?? 0);
        competitor.priceIndex = (raw.price_index as number | undefined) ?? null;
        competitor.previousPriceIndex = (raw.previous_price_index as number | undefined) ?? null;

        return competitor;
    }
}
