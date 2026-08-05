import {ApiRecord} from '../../Model/ApiRecord.js';
import {MatchedVendorProduct} from './MatchedVendorProduct.js';

/** What a pricing strategy proposes for a product, and which rule proposed it. */
export type PriceProposal = {
    price: number;
    strategyName: string;
    strategyDetails: string;
};

/**
 * One of the catalog's products with the competitor products matched to it — the
 * `/pulse/catalogs/:catalogId/products` resource.
 *
 * `costPrice` is only present when the catalog carries cost data; margin and profit are left to
 * the caller, since what counts as margin differs per client.
 */
export class CatalogProductWithMatches {
    public id: string;
    public name: string = '';
    public image: string | null = null;
    public gtin: string | null = null;
    public brand: string | null = null;
    public url: string | null = null;
    public price: number = 0;
    public costPrice: number | null = null;
    public priceProposal: PriceProposal | null = null;
    public matches: MatchedVendorProduct[] = [];

    public constructor(id: string) {
        this.id = id;
    }

    /** Mean price of the matched competitor products; null when nothing matched. */
    public get matchesAveragePrice(): number | null {
        if (this.matches.length === 0) {
            return null;
        }
        const total: number = this.matches.reduce((sum: number, match: MatchedVendorProduct) => sum + match.price, 0);

        return total / this.matches.length;
    }

    public static parse(raw: ApiRecord): CatalogProductWithMatches {
        const product: CatalogProductWithMatches = new CatalogProductWithMatches(raw.id as string);
        product.name = (raw.name as string | undefined) ?? '';
        product.image = (raw.image as string | undefined) ?? null;
        product.gtin = (raw.gtin as string | undefined) ?? null;
        product.brand = (raw.brand as string | undefined) ?? null;
        product.url = (raw.url as string | undefined) ?? null;
        product.price = parseFloat(raw.price as string) || 0;
        product.costPrice = (raw.cost_price as number | undefined) ?? null;

        const proposal: Record<string, unknown> | null = (raw.price_proposal as Record<string, unknown> | undefined) ?? null;
        product.priceProposal = proposal === null ? null : {
            price: proposal.price as number,
            strategyName: proposal.strategy_name as string,
            strategyDetails: proposal.strategy_details as string,
        };

        const matches: Record<string, unknown>[] = (raw.matches as Record<string, unknown>[] | undefined) ?? [];
        product.matches = matches.map((match: Record<string, unknown>) => MatchedVendorProduct.parse(match as ApiRecord));

        return product;
    }
}
