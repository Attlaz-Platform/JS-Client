import {ApiRecord} from '../../Model/ApiRecord.js';
import {POSITION_BUCKETS, PositionBucket} from './PositionBucket.js';

/**
 * One brand or category against the market — `/pulse/catalogs/:catalogId/market-positions/aggregate`:
 * how much of it can be compared, and where the compared products stand.
 */
export class MarketPositionGroup {
    /** The brand or category; null for products without one. */
    public groupValue: string | null = null;
    /** Every product in the group with a stored position, compared with a competitor or not. */
    public productCount: number = 0;
    /** Of those, the ones with at least one counted competitor; the average and buckets cover only these. */
    public comparedCount: number = 0;
    /** Active products whose barcode a tracked competitor also sells: what could be compared at all. */
    public matchableCount: number = 0;
    /** Our price against the median competitor price, averaged; −20 is 20% cheaper. Null when none compared. */
    public avgPriceVsMedianPct: number | null = null;
    public bucketCounts: Record<PositionBucket, number> = {very_sharp: 0, sharp: 0, market_rate: 0, expensive: 0, much_more_expensive: 0};

    public static parse(raw: ApiRecord): MarketPositionGroup {
        const group: MarketPositionGroup = new MarketPositionGroup();
        group.groupValue = (raw.group_value as string | null | undefined) ?? null;
        group.productCount = Number(raw.product_count ?? 0);
        group.comparedCount = Number(raw.compared_count ?? 0);
        group.matchableCount = Number(raw.matchable_count ?? 0);
        group.avgPriceVsMedianPct = raw.avg_price_vs_median_pct === null || raw.avg_price_vs_median_pct === undefined ? null : Number(raw.avg_price_vs_median_pct);
        const buckets: Record<string, unknown> = (raw.bucket_counts as Record<string, unknown> | undefined) ?? {};
        for (const bucket of POSITION_BUCKETS) {
            group.bucketCounts[bucket] = Number(buckets[bucket] ?? 0);
        }

        return group;
    }
}
