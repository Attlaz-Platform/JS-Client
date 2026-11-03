import {ApiRecord} from '../../Model/ApiRecord.js';
import {MatchDecisionSource} from './MatchDecisionSource.js';
import {ProductMatchStatus} from './ProductMatch.js';

/** One side of a match, reduced to what a reviewer needs to judge it. */
export type ReviewProduct = {
    id: string;
    name: string;
    brand: string | null;
    gtin: string | null;
    sku: string | null;
    price: number | null;
    originalPrice: number | null;
    /** ISO 4217. Null falls back to the vendor's currency — never assume EUR when rendering. */
    currency: string | null;
    shippingCost: number | null;
    url: string | null;
    image: string | null;
    /** Lifted out of {@link properties} because the matcher scores against it. */
    category: string | null;
    inStock: boolean | null;
    /** The scraped attribute bag (tags, variant options, …). Keys are data, not schema. */
    properties: Record<string, unknown> | null;
};

/** The competitor side additionally names the vendor it came from. */
export type ReviewCompetitorProduct = ReviewProduct & {
    vendor: {id: string; name: string; icon: string | null};
};

/**
 * A match queued for human review — the `/pulse/catalogs/:catalogId/matches` resource.
 *
 * Both products are returned side by side so a reviewer can accept or decline without a second
 * request; `confidence` is the matcher's own certainty (0-1).
 */
export class ReviewMatch {
    /** The id of the match record — the value to pass to accept/decline. */
    public matchId: string;
    public status: ProductMatchStatus = 'pending';
    public confidence: number | null = null;
    public createdAt: Date | null = null;
    /** Who made the current decision; null only on rows that predate recording it. */
    public decisionSource: MatchDecisionSource | null = null;
    public decidedAt: Date | null = null;
    public own: ReviewProduct;
    public competitor: ReviewCompetitorProduct;

    public constructor(matchId: string, own: ReviewProduct, competitor: ReviewCompetitorProduct) {
        this.matchId = matchId;
        this.own = own;
        this.competitor = competitor;
    }

    /** Alias of {@link matchId}: collection helpers key rows on `id`. */
    public get id(): string {
        return this.matchId;
    }

    public static parse(raw: ApiRecord): ReviewMatch {
        const rawCompetitor: Record<string, unknown> = raw.competitor as Record<string, unknown>;
        const rawVendor: Record<string, unknown> = rawCompetitor.vendor as Record<string, unknown>;

        const match: ReviewMatch = new ReviewMatch(
            // The API strips the `_id` suffix, so `match_id` arrives as `match`.
            raw.match as string,
            ReviewMatch.parseProduct(raw.own as Record<string, unknown>),
            {
                ...ReviewMatch.parseProduct(rawCompetitor),
                vendor: {
                    id: rawVendor.id as string,
                    name: rawVendor.name as string,
                    icon: (rawVendor.icon as string | undefined) ?? null,
                },
            },
        );
        match.status = (raw.status as ProductMatchStatus | undefined) ?? 'pending';
        match.confidence = (raw.confidence as number | undefined) ?? null;
        match.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        match.decisionSource = (raw.decision_source as MatchDecisionSource | undefined) ?? null;
        match.decidedAt = raw.decided_at ? new Date(raw.decided_at as string) : null;

        return match;
    }

    private static parseProduct(raw: Record<string, unknown>): ReviewProduct {
        return {
            id: raw.id as string,
            name: raw.name as string,
            brand: (raw.brand as string | undefined) ?? null,
            gtin: (raw.gtin as string | undefined) ?? null,
            sku: (raw.sku as string | undefined) ?? null,
            price: (raw.price as number | undefined) ?? null,
            originalPrice: (raw.original_price as number | undefined) ?? null,
            currency: (raw.currency as string | undefined) ?? null,
            shippingCost: (raw.shipping_cost as number | undefined) ?? null,
            url: (raw.url as string | undefined) ?? null,
            image: (raw.image as string | undefined) ?? null,
            category: (raw.category as string | undefined) ?? null,
            inStock: typeof raw.in_stock === 'boolean' ? raw.in_stock : null,
            properties: (raw.properties as Record<string, unknown> | undefined) ?? null,
        };
    }
}
