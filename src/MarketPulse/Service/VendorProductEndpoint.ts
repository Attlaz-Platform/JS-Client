import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CompetingVendorProduct} from '../Model/CompetingVendorProduct.js';
import {VendorProduct} from '../Model/VendorProduct.js';
import {VendorProductPriceHistoryEntry} from '../Model/VendorProductPriceHistoryEntry.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

/**
 * Market Pulse competitor products — `/pulse/vendors/:vendorId/products`. Mirrors the PHP client's
 * MarketPulse\VendorProductEndpoint so the (Node) scraper can upsert competitor products.
 */
export class VendorProductEndpoint extends Endpoint {

    /** The product with this identifier for the vendor, or null. */
    public async getByIdentifier(vendorId: string, identifier: string): Promise<VendorProduct | null> {
        const result: CollectionResult<VendorProduct> = await this.requestCollection(
            path('/pulse/vendors/:vendorId/products', {vendorId}) + '?identifier=' + encodeURIComponent(identifier),
            VendorProduct.parse,
        );
        const products: VendorProduct[] = result.getData();
        return products.length > 0 ? products[0]! : null;
    }

    /**
     * The products of one of a catalog's competitors — `/pulse/competing-vendors/:competitorId/products`.
     * Same products as {@link getByVendor}, read through the competitor, so `competitorId` is set.
     */
    public async getByCompetitor(competitorId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<CompetingVendorProduct>> {
        const queryString: QueryString = new QueryString(path('/pulse/competing-vendors/:competitorId/products', {competitorId}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, CompetingVendorProduct.parse);
    }

    /** A single competitor product — `/pulse/competing-vendors/products/:id`. */
    public async getCompetitorProductById(competingVendorProductId: string): Promise<CompetingVendorProduct | null> {
        const result: ObjectResult<CompetingVendorProduct> = await this.requestObject(
            path('/pulse/competing-vendors/products/:competingVendorProductId', {competingVendorProductId}),
            null,
            CompetingVendorProduct.parse,
            'GET',
        );

        return result.getData();
    }

    /** A vendor's products. */
    public async getByVendor(vendorId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<VendorProduct>> {
        const queryString: QueryString = new QueryString(path('/pulse/vendors/:vendorId/products', {vendorId}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, VendorProduct.parse);
    }

    /**
     * Recorded price changes for a competitor product, newest first. `limit` caps the number of
     * entries (the API defaults to 365).
     */
    public async getPriceHistory(vendorProductId: string, limit: number | null = null): Promise<VendorProductPriceHistoryEntry[]> {
        const queryString: QueryString = new QueryString(path('/pulse/vendor-products/:vendorProductId/price-history', {vendorProductId}));
        if (limit !== null) {
            queryString.set('limit', limit.toString());
        }
        const result: CollectionResult<VendorProductPriceHistoryEntry> = await this.requestCollection(
            queryString,
            VendorProductPriceHistoryEntry.parse,
        );

        return result.getData();
    }

    /** Create a new vendor product. */
    public async save(product: VendorProduct): Promise<VendorProduct> {
        // camelCase keys are snake_cased by the base Endpoint (originalPrice -> original_price, ...).
        const body = {
            name: product.name,
            image: product.image,
            identifier: product.identifier,
            gtin: product.gtin,
            sku: product.sku,
            brand: product.brand,
            url: product.url,
            currency: product.currency,
            price: product.price,
            originalPrice: product.originalPrice,
            shippingCost: product.shippingCost,
            stockStatus: product.stockStatus,
            properties: product.properties,
        };
        const result: ObjectResult<VendorProduct> = await this.requestObject(
            path('/pulse/vendors/:vendorId/products', {vendorId: product.vendorId}),
            body,
            VendorProduct.parse,
            'POST',
        );
        return result.getData() ?? product;
    }

    /** Update the mutable fields of an existing vendor product (JSON-patch style, per the API). */
    public async update(product: VendorProduct): Promise<void> {
        const operations = [
            {op: 'add', path: 'name', value: product.name},
            {op: 'add', path: 'price', value: product.price},
            {op: 'add', path: 'original_price', value: product.originalPrice},
            {op: 'add', path: 'brand', value: product.brand},
            {op: 'add', path: 'shipping_cost', value: product.shippingCost},
            {op: 'add', path: 'stock_status', value: product.stockStatus},
            {op: 'add', path: 'url', value: product.url},
            {op: 'add', path: 'gtin', value: product.gtin},
            {op: 'add', path: 'image', value: product.image},
            {op: 'add', path: 'sku', value: product.sku},
            {op: 'add', path: 'currency', value: product.currency},
            {op: 'add', path: 'properties', value: product.properties},
        ];
        if (product.id === null) {
            throw new Error('Unable to update vendor product: the product has no id. Save it first.');
        }
        await this.requestObject(
            path('/pulse/vendors/:vendorId/products/:id', {vendorId: product.vendorId, id: product.id}),
            operations,
            (raw: unknown): unknown => raw,
            'PATCH',
        );
    }
}
