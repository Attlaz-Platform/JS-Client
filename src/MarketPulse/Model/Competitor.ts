import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A vendor as one catalog watches it — the `/pulse/catalogs/:catalogId/competing-vendors` resource
 * (a `Competitor` server-side). The same vendor can be a competitor in several catalogs, which is
 * why the counts and timestamps below belong here and not on {@link Vendor}.
 *
 * `priceIndex` is this competitor's prices relative to the catalog's own, over the matched
 * products: 100 means level, below 100 means the competitor is cheaper.
 */
export class Competitor {
    public id: string;
    public vendorId: string;
    public name: string;
    public domain: string = '';
    public icon: string | null = null;
    public type: string | null = null;
    /** Which index (embedding set) the competitor's products are held in. */
    public index: string = '';
    public matchCount: number = 0;
    public productCount: number = 0;
    public priceIndex: number = 0;
    public lastScrapedAt: Date | null = null;
    public lastIndexedAt: Date | null = null;
    public lastMatchedAt: Date | null = null;

    public constructor(id: string, vendorId: string, name: string) {
        this.id = id;
        this.vendorId = vendorId;
        this.name = name;
    }

    public static parse(raw: ApiRecord): Competitor {
        const competitor: Competitor = new Competitor(
            raw.id as string,
            raw.vendor as string,
            (raw.name as string | undefined) ?? '',
        );
        competitor.domain = (raw.domain as string | undefined) ?? '';
        competitor.icon = (raw.icon as string | undefined) ?? null;
        competitor.type = (raw.type as string | undefined) ?? null;
        competitor.index = (raw.index as string | undefined) ?? '';
        competitor.matchCount = Number(raw.match_count ?? 0);
        competitor.productCount = Number(raw.product_count ?? 0);
        competitor.priceIndex = Number(raw.price_index ?? 0);
        competitor.lastScrapedAt = raw.last_scraped_at ? new Date(raw.last_scraped_at as string) : null;
        competitor.lastIndexedAt = raw.last_indexed_at ? new Date(raw.last_indexed_at as string) : null;
        competitor.lastMatchedAt = raw.last_matched_at ? new Date(raw.last_matched_at as string) : null;

        return competitor;
    }
}
