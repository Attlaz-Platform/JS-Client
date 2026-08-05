import {ApiRecord} from '../../Model/ApiRecord.js';
import {VendorProduct} from './VendorProduct.js';

/**
 * A competitor's product read through the catalog's competitor —
 * `/pulse/competing-vendors/:competitorId/products`.
 *
 * The same product as {@link VendorProduct}; the competitor is what the catalog knows the vendor
 * as, so it exists only on this view. A vendor can be a competitor in several catalogs, which is
 * why `competitorId` is not a property of the product itself.
 */
export class CompetingVendorProduct extends VendorProduct {
    public competitorId: string;

    public constructor(vendorId: string, identifier: string, competitorId: string) {
        super(vendorId, identifier);
        this.competitorId = competitorId;
    }

    public static override parse(raw: ApiRecord): CompetingVendorProduct {
        const product: CompetingVendorProduct = new CompetingVendorProduct(
            raw.vendor as string,
            raw.identifier as string,
            raw.competitor as string,
        );
        product.fill(raw);

        return product;
    }
}
