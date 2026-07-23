import {VendorProduct} from '../../Model/Pulse/VendorProduct.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../Endpoint.js';

/**
 * Market Pulse competitor products — `/pulse/vendors/:vendorId/products`. Mirrors the PHP client's
 * MarketPulse\VendorProductEndpoint so the (Node) scraper can upsert competitor products.
 */
export class VendorProductEndpoint extends Endpoint {

    /** The product with this identifier for the vendor, or null. */
    public async getByIdentifier(vendorId: string, identifier: string): Promise<VendorProduct | null> {
        const result: CollectionResult<VendorProduct> = await this.requestCollection(
            '/pulse/vendors/' + vendorId + '/products?identifier=' + encodeURIComponent(identifier),
            VendorProduct.parse,
        );
        const products: VendorProduct[] = result.getData();
        return products.length > 0 ? products[0]! : null;
    }

    /** Create a new vendor product. */
    public async save(product: VendorProduct): Promise<VendorProduct> {
        // camelCase keys are snake_cased by the base Endpoint (originalPrice -> original_price, ...).
        const body = {
            name: product.name,
            image: product.image,
            identifier: product.identifier,
            gtin: product.gtin,
            brand: product.brand,
            url: product.url,
            currency: product.currency,
            price: product.price,
            originalPrice: product.originalPrice,
            shippingCost: product.shippingCost,
            isInStock: product.isInStock,
            properties: product.properties,
        };
        const result: ObjectResult<VendorProduct> = await this.requestObject(
            '/pulse/vendors/' + product.vendorId + '/products',
            body,
            VendorProduct.parse,
            'POST',
        );
        return result.getData() ?? product;
    }

    /** Update the mutable fields of an existing vendor product (JSON-patch style, per the API). */
    public async update(product: VendorProduct): Promise<void> {
        const operations = [
            {op: 'add', path: 'price', value: product.price},
            {op: 'add', path: 'original_price', value: product.originalPrice},
            {op: 'add', path: 'brand', value: product.brand},
            {op: 'add', path: 'shipping_cost', value: product.shippingCost},
            {op: 'add', path: 'is_in_stock', value: product.isInStock},
            {op: 'add', path: 'url', value: product.url},
            {op: 'add', path: 'gtin', value: product.gtin},
            {op: 'add', path: 'image', value: product.image},
            {op: 'add', path: 'properties', value: product.properties},
        ];
        await this.requestObject(
            '/pulse/vendors/' + product.vendorId + '/products/' + product.id,
            operations,
            (raw: unknown): unknown => raw,
            'PATCH',
        );
    }
}
