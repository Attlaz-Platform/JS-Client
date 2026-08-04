import {ApiRecord} from '../../Model/ApiRecord.js';
import {CatalogId} from './CatalogId.js';

/**
 * A vendor product assigned to a catalog — the `/catalogs/:catalogId/products` resource.
 *
 * The descriptive fields (name, image, gtin, price) belong to the linked vendor product and are
 * never duplicated here. This record holds what the catalog itself knows about the product: the
 * identifier it is addressed by, its cost price, and whatever the import source attached.
 */
export class CatalogProduct {
    public id: string;
    public catalogId: CatalogId;
    /** The product's stable identifier within the catalog (the upsert key on import). */
    public identifier: string;
    public vendorProductId: string | null = null;
    public costPrice: number | null = null;
    public createdAt: Date | null = null;
    public updatedAt: Date | null = null;

    public constructor(id: string, catalogId: CatalogId, identifier: string) {
        this.id = id;
        this.catalogId = catalogId;
        this.identifier = identifier;
    }

    public static parse(raw: ApiRecord): CatalogProduct {
        const product: CatalogProduct = new CatalogProduct(
            raw.id as string,
            new CatalogId(raw.catalog as string),
            (raw.identifier as string | undefined) ?? '',
        );
        product.vendorProductId = (raw.vendor_product as string | undefined) ?? null;
        product.costPrice = (raw.cost_price as number | undefined) ?? null;
        product.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        product.updatedAt = raw.updated_at ? new Date(raw.updated_at as string) : null;

        return product;
    }
}
