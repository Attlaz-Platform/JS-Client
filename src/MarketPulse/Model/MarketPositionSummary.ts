import {ApiRecord} from '../../Model/ApiRecord.js';
import {POSITION_BUCKETS, PositionBucket} from './PositionBucket.js';

/**
 * The catalog against the market — `/pulse/catalogs/:catalogId/market-positions/summary`: how many
 * products can be compared at all, where the compared ones stand, and how current the competitor prices
 * behind it are.
 */
export class MarketPositionSummary {
    public productCount: number = 0;
    /** Products with at least one counted competitor in the latest recompute. */
    public comparedCount: number = 0;
    public bucketCounts: Record<PositionBucket, number> = {very_sharp: 0, sharp: 0, market_rate: 0, expensive: 0, much_more_expensive: 0};
    public computedAt: Date | null = null;
    /** Our price ÷ the median competitor price × 100, averaged over the compared products. 100 = equal. */
    public marketIndex: number | null = null;
    /** By value: the sum of our prices ÷ the sum of the median competitor prices × 100. */
    public marketIndexByValue: number | null = null;
    /** Active products whose barcode a tracked competitor also sells: the ones that can be compared. */
    public matchableCount: number = 0;
    /** The counted competitor prices, and how many of them a crawl saw within `recentDays`. */
    public competitorPriceCount: number = 0;
    public recentCompetitorPriceCount: number = 0;
    public recentDays: number = 0;
    public priceHistoryFrom: Date | null = null;

    public static parse(raw: ApiRecord): MarketPositionSummary {
        const summary: MarketPositionSummary = new MarketPositionSummary();
        summary.productCount = Number(raw.product_count ?? 0);
        summary.comparedCount = Number(raw.compared_count ?? 0);
        const buckets: Record<string, unknown> = (raw.bucket_counts as Record<string, unknown> | undefined) ?? {};
        for (const bucket of POSITION_BUCKETS) {
            summary.bucketCounts[bucket] = Number(buckets[bucket] ?? 0);
        }
        summary.computedAt = raw.computed_at ? new Date(raw.computed_at as string) : null;
        summary.marketIndex = raw.market_index === null || raw.market_index === undefined ? null : Number(raw.market_index);
        summary.marketIndexByValue = raw.market_index_by_value === null || raw.market_index_by_value === undefined ? null : Number(raw.market_index_by_value);
        summary.matchableCount = Number(raw.matchable_count ?? 0);
        summary.competitorPriceCount = Number(raw.competitor_price_count ?? 0);
        summary.recentCompetitorPriceCount = Number(raw.recent_competitor_price_count ?? 0);
        summary.recentDays = Number(raw.recent_days ?? 0);
        summary.priceHistoryFrom = raw.price_history_from ? new Date(raw.price_history_from as string) : null;

        return summary;
    }
}
