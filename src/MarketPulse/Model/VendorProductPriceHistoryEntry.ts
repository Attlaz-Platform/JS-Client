import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One recorded price point of a competitor product — the `/pulse/vendor-products/:id/price-history`
 * resource. Written when a crawl finds a price that differs from the last recorded one, so the
 * entries are change points rather than a reading per crawl.
 */
export class VendorProductPriceHistoryEntry {
    public id: string;
    public vendorProductId: string;
    public price: number | null = null;
    public originalPrice: number | null = null;
    public shippingCost: number | null = null;
    public isInStock: boolean | null = null;
    public isPromotion: boolean | null = null;
    public recordedAt: Date | null = null;

    public constructor(id: string, vendorProductId: string) {
        this.id = id;
        this.vendorProductId = vendorProductId;
    }

    public static parse(raw: ApiRecord): VendorProductPriceHistoryEntry {
        const entry: VendorProductPriceHistoryEntry = new VendorProductPriceHistoryEntry(
            raw.id as string,
            raw.vendor_product as string,
        );
        entry.price = toNumber(raw.price);
        entry.originalPrice = toNumber(raw.original_price);
        entry.shippingCost = toNumber(raw.shipping_cost);
        entry.isInStock = typeof raw.is_in_stock === 'boolean' ? raw.is_in_stock : null;
        entry.isPromotion = typeof raw.is_promotion === 'boolean' ? raw.is_promotion : null;
        entry.recordedAt = raw.recorded_at ? new Date(raw.recorded_at as string) : null;

        return entry;
    }
}

function toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const parsed: number = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
}
