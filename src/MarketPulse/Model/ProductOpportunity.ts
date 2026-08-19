import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * What the detection engine found wrong with a product's price.
 *
 * Duplicated from apps-lib rather than imported, per the client's enum-duplication convention: the
 * client must not depend on a server package.
 */
export type OpportunityType =
    | 'OVERPRICED_WITH_ROOM'   // above the median competitor price, with margin left to cut
    | 'NEEDLESSLY_CHEAP'       // below the cheapest rival — margin is being given away
    | 'UNCOMPETITIVE'          // above the market with no margin to cut; delist or deprioritise
    | 'JUST_CHANGED';          // position moved far enough since the last run to be worth a look

/**
 * One detected pricing opportunity on one catalog product — the `/pulse/…/opportunities` resource.
 *
 * A derived cache, not history: every recompute delete-and-replaces the whole catalog, so a product
 * that stops qualifying simply stops appearing. A product can hold two of these, because
 * `JUST_CHANGED` co-occurs with one of the price types — which is why `id` is the (product, type)
 * pair rather than the product id.
 *
 * The reference price throughout is the **median** of the product's matched, in-stock competitors,
 * never the average. `NEEDLESSLY_CHEAP` is the one type judged against the cheapest rival instead.
 */
export class ProductOpportunity {
    public id: string;
    public catalogProductId: string;
    public type: OpportunityType;

    /** Money at stake. Ranks the worklist within one type; not comparable across types. */
    public score: number = 0;

    public priceVsMedianPct: number | null = null;
    public marginPct: number | null = null;
    public medianCompetitorPrice: number | null = null;
    public competitorCount: number = 0;

    public computedAt: Date | null = null;

    /** Which threshold set produced this row, so rows from an older configuration are identifiable. */
    public configVersion: number = 0;

    // The own product, carried on the row so a worklist renders without a call per product.
    public productName: string = '';
    public productImage: string | null = null;
    public productBrand: string | null = null;
    public productSku: string | null = null;
    public ownPrice: number = 0;
    /**
     * What the product costs you. **Null means unknown, not free** — the API resolves a stored zero
     * to null where the catalog's source uses zero for "never entered". The same unknown is why
     * `marginPct` can be null.
     */
    public costPrice: number | null = null;
    /** The product's own currency. Never assume one — see DECISIONS.md (2026-08-08). */
    public currency: string | null = null;

    public constructor(id: string, catalogProductId: string, type: OpportunityType) {
        this.id = id;
        this.catalogProductId = catalogProductId;
        this.type = type;
    }

    public static parse(raw: ApiRecord): ProductOpportunity {
        const opportunity: ProductOpportunity = new ProductOpportunity(
            raw.id as string,
            raw.catalog_product as string,
            raw.type as OpportunityType,
        );
        opportunity.score = Number(raw.score ?? 0);
        opportunity.priceVsMedianPct = raw.price_vs_median_pct === null || raw.price_vs_median_pct === undefined ? null : Number(raw.price_vs_median_pct);
        opportunity.marginPct = raw.margin_pct === null || raw.margin_pct === undefined ? null : Number(raw.margin_pct);
        opportunity.medianCompetitorPrice = raw.median_competitor_price === null || raw.median_competitor_price === undefined ? null : Number(raw.median_competitor_price);
        opportunity.competitorCount = Number(raw.competitor_count ?? 0);
        opportunity.computedAt = raw.computed_at ? new Date(raw.computed_at as string) : null;
        opportunity.configVersion = Number(raw.config_version ?? 0);

        opportunity.productName = (raw.product_name as string | undefined) ?? '';
        opportunity.productSku = (raw.product_sku as string | undefined) ?? null;
        opportunity.costPrice = raw.cost_price === null || raw.cost_price === undefined ? null : Number(raw.cost_price);
        opportunity.productImage = (raw.product_image as string | undefined) ?? null;
        opportunity.productBrand = (raw.product_brand as string | undefined) ?? null;
        opportunity.ownPrice = Number(raw.own_price ?? 0);
        opportunity.currency = (raw.currency as string | undefined) ?? null;

        return opportunity;
    }
}
