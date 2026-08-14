import {StockStatus, parseStockStatus} from './StockStatus.js';
import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A competitor's product as tracked by Market Pulse — the `/pulse/vendors/:vendorId/products`
 * resource. `identifier` is the product's stable id on the competitor's site (the upsert key).
 */
export class VendorProduct {
    public id: string | null = null;
    public vendorId: string;
    public identifier: string;
    public name: string | null = null;
    public image: string | null = null;
    public gtin: string | null = null;
    public brand: string | null = null;
    public url: string | null = null;
    public sku: string | null = null;
    public currency: string | null = null;
    public price: number | null = null;
    public originalPrice: number | null = null;
    public shippingCost: number | null = null;
    public stockStatus: StockStatus = 'unknown';
    public properties: Record<string, unknown> | null = null;
    public createdAt: Date | null = null;
    public updatedAt: Date | null = null;

    public constructor(vendorId: string, identifier: string) {
        this.vendorId = vendorId;
        this.identifier = identifier;
    }

    public static parse(raw: ApiRecord): VendorProduct {
        const product: VendorProduct = new VendorProduct(raw.vendor as string, raw.identifier as string);
        product.fill(raw);

        return product;
    }

    /**
     * Read the fields every vendor-product response carries. Split out so a subclass can reuse it
     * from its own `parse` without repeating them.
     */
    protected fill(raw: ApiRecord): void {
        const product: VendorProduct = this;
        product.id = (raw.id as string | undefined) ?? null;
        product.name = (raw.name as string | undefined) ?? null;
        product.image = (raw.image as string | undefined) ?? null;
        product.gtin = (raw.gtin as string | undefined) ?? null;
        product.brand = (raw.brand as string | undefined) ?? null;
        product.url = (raw.url as string | undefined) ?? null;
        product.sku = (raw.sku as string | undefined) ?? null;
        product.currency = (raw.currency as string | undefined) ?? null;
        product.price = toNumber(raw.price);
        product.originalPrice = toNumber(raw.original_price);
        product.shippingCost = toNumber(raw.shipping_cost);
        product.stockStatus = parseStockStatus(raw.stock_status);
        product.properties = (raw.properties as Record<string, unknown> | undefined) ?? null;
        product.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        product.updatedAt = raw.updated_at ? new Date(raw.updated_at as string) : null;
    }
}

function toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const n: number = Number(value);
    return Number.isFinite(n) ? n : null;
}
