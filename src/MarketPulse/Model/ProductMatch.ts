import {ApiRecord} from '../../Model/ApiRecord.js';

/** Where a match came from and what happened to it since. */
export type ProductMatchStatus = 'pending' | 'accepted' | 'declined';

/**
 * The link between one of the catalog's products and a competitor's — the `/pulse/matches/:matchId`
 * resource.
 *
 * This is the match *record*: how it was made (`matchType`), how sure the matcher was
 * (`confidence`, 0-1) and whether a human has since accepted or declined it. The two products it
 * joins are read through {@link MatchedVendorProduct} or {@link ReviewMatch}.
 */
export class ProductMatch {
    public id: string;
    public matchType: string = '';
    public confidence: number | null = null;
    public metadata: Record<string, unknown> | null = null;
    public status: ProductMatchStatus = 'pending';
    public createdAt: Date | null = null;

    public constructor(id: string) {
        this.id = id;
    }

    public static parse(raw: ApiRecord): ProductMatch {
        const match: ProductMatch = new ProductMatch(raw.id as string);
        match.matchType = (raw.match_type as string | undefined) ?? '';
        match.confidence = (raw.confidence as number | undefined) ?? null;
        match.metadata = (raw.metadata as Record<string, unknown> | undefined) ?? null;
        match.status = (raw.status as ProductMatchStatus | undefined) ?? 'pending';
        match.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;

        return match;
    }
}
