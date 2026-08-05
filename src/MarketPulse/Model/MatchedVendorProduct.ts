import {ApiRecord} from '../../Model/ApiRecord.js';
import {Vendor} from './Vendor.js';

/**
 * A competitor's product as it appears against one of your own — what
 * `/pulse/catalogs/:catalogId/products?expand=matches.vendor` nests under each product.
 *
 * It carries the competitor product's own fields plus the linkage back to the match record
 * ({@link ProductMatch}) and the job that produced it, so the UI can show the price side by side
 * and still open the match.
 */
export class MatchedVendorProduct {
    /** Id of the competitor's product. */
    public id: string;
    /** Id of the match record joining it to your product; null for an unreviewed direct hit. */
    public matchId: string | null = null;
    public matchJobId: string | null = null;

    public vendor: Vendor | null = null;
    public name: string = '';
    public image: string | null = null;
    public brand: string | null = null;
    public gtin: string | null = null;
    public url: string | null = null;
    public price: number = 0;
    public shippingCost: number = 0;
    public inStock: boolean | null = null;
    public updatedAt: Date | null = null;

    public constructor(id: string) {
        this.id = id;
    }

    public static parse(raw: ApiRecord): MatchedVendorProduct {
        const product: MatchedVendorProduct = new MatchedVendorProduct(raw.id as string);
        product.matchId = (raw.match as string | undefined) ?? null;
        product.matchJobId = (raw.match_job as string | undefined) ?? null;

        const vendor: unknown = raw.vendor;
        if (vendor !== null && typeof vendor === 'object') {
            product.vendor = Vendor.parse(vendor as ApiRecord);
        }

        product.name = (raw.name as string | undefined) ?? '';
        product.image = (raw.image as string | undefined) ?? null;
        product.brand = (raw.brand as string | undefined) ?? null;
        product.gtin = (raw.gtin as string | undefined) ?? null;
        product.url = (raw.url as string | undefined) ?? null;
        product.price = parseFloat(raw.price as string) || 0;
        product.shippingCost = parseFloat(raw.shipping_cost as string) || 0;
        product.inStock = typeof raw.in_stock === 'boolean' ? raw.in_stock : null;
        product.updatedAt = raw.updated ? new Date(raw.updated as string) : null;

        return product;
    }
}
