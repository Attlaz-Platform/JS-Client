import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One competitor's price index on one day — the
 * `/pulse/catalogs/:catalogId/statistics/price-index-history` resource.
 *
 * `date` stays the API's `YYYY-MM-DD` string rather than a Date: these are calendar buckets, and
 * converting them to Date would push them across day boundaries in other timezones.
 */
export class PriceIndexSnapshotEntry {
    public date: string;
    // Null for the market line: every competitor together.
    public competitorId: string | null;
    public priceIndex: number = 0;
    public matchCount: number = 0;

    public constructor(date: string, competitorId: string | null) {
        this.date = date;
        this.competitorId = competitorId;
    }

    public static parse(raw: ApiRecord): PriceIndexSnapshotEntry {
        const entry: PriceIndexSnapshotEntry = new PriceIndexSnapshotEntry(
            raw.date as string,
            (raw.competitor as string | null | undefined) ?? null,
        );
        entry.priceIndex = Number(raw.price_index ?? 0);
        entry.matchCount = Number(raw.match_count ?? 0);

        return entry;
    }
}
