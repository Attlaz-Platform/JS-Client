import {ApiRecord} from '../../Model/ApiRecord.js';

export type PriceSuggestionStatus = 'pending' | 'approved' | 'rejected';

/**
 * A proposed new price for one of the catalog's products — the `/pulse/price-suggestions` resource.
 *
 * Produced by a {@link PricingRule} (or by a strategy run directly, leaving `pricingRuleId` null).
 * `reason` records the competitor prices the suggestion was derived from, so a reviewer can see why
 * without re-deriving it. Approving one does not push the price: `appliedAt` is set once a flow has
 * written it back to the shop.
 */
export class PriceSuggestion {
    public id: string;
    public catalogProductId: string;
    public pricingRuleId: string | null = null;
    public currentPrice: number = 0;
    public suggestedPrice: number = 0;
    public strategyName: string = '';
    public strategyDetails: string | null = null;
    public reason: Record<string, unknown> | null = null;
    public status: PriceSuggestionStatus = 'pending';
    public createdAt: Date | null = null;
    public reviewedAt: Date | null = null;
    public reviewedBy: string | null = null;
    public appliedAt: Date | null = null;

    public constructor(id: string, catalogProductId: string) {
        this.id = id;
        this.catalogProductId = catalogProductId;
    }

    /** Difference against the current price; negative means the suggestion is a price cut. */
    public get priceDifference(): number {
        return this.suggestedPrice - this.currentPrice;
    }

    public static parse(raw: ApiRecord): PriceSuggestion {
        const suggestion: PriceSuggestion = new PriceSuggestion(raw.id as string, raw.catalog_product as string);
        suggestion.pricingRuleId = (raw.pricing_rule as string | undefined) ?? null;
        suggestion.currentPrice = Number(raw.current_price ?? 0);
        suggestion.suggestedPrice = Number(raw.suggested_price ?? 0);
        suggestion.strategyName = (raw.strategy_name as string | undefined) ?? '';
        suggestion.strategyDetails = (raw.strategy_details as string | undefined) ?? null;
        suggestion.reason = (raw.reason as Record<string, unknown> | undefined) ?? null;
        suggestion.status = (raw.status as PriceSuggestionStatus | undefined) ?? 'pending';
        suggestion.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        suggestion.reviewedAt = raw.reviewed_at ? new Date(raw.reviewed_at as string) : null;
        suggestion.reviewedBy = (raw.reviewed_by as string | undefined) ?? null;
        suggestion.appliedAt = raw.applied_at ? new Date(raw.applied_at as string) : null;

        return suggestion;
    }
}
