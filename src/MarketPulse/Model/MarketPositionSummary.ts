import {ApiRecord} from '../../Model/ApiRecord.js';
import {POSITION_BUCKETS, PositionBucket} from './PositionBucket.js';

/**
 * The catalog against the market — `/pulse/catalogs/:catalogId/market-positions/summary`: how many
 * products can be compared at all, where the compared ones stand, and how old the competitor prices
 * behind it are.
 */
export class MarketPositionSummary {
    public productCount: number = 0;
    /** Products with at least one counted competitor in the latest recompute. */
    public comparedCount: number = 0;
    public bucketCounts: Record<PositionBucket, number> = {very_sharp: 0, sharp: 0, market_rate: 0, expensive: 0, much_more_expensive: 0};
    public computedAt: Date | null = null;
    /** When the counted competitor products were last seen by a crawl: the age of the prices compared. */
    public pricesSeenFrom: Date | null = null;
    public pricesSeenTo: Date | null = null;

    public static parse(raw: ApiRecord): MarketPositionSummary {
        const summary: MarketPositionSummary = new MarketPositionSummary();
        summary.productCount = Number(raw.product_count ?? 0);
        summary.comparedCount = Number(raw.compared_count ?? 0);
        const buckets: Record<string, unknown> = (raw.bucket_counts as Record<string, unknown> | undefined) ?? {};
        for (const bucket of POSITION_BUCKETS) {
            summary.bucketCounts[bucket] = Number(buckets[bucket] ?? 0);
        }
        summary.computedAt = raw.computed_at ? new Date(raw.computed_at as string) : null;
        summary.pricesSeenFrom = raw.prices_seen_from ? new Date(raw.prices_seen_from as string) : null;
        summary.pricesSeenTo = raw.prices_seen_to ? new Date(raw.prices_seen_to as string) : null;

        return summary;
    }
}
