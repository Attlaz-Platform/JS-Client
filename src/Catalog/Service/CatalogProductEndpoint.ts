import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {CatalogId} from '../Model/CatalogId.js';
import {CatalogProduct} from '../Model/CatalogProduct.js';

/**
 * The products of a catalog — `/catalogs/:catalogId/products`.
 *
 * Market Pulse's view of the same products, with the competitor matches attached, is
 * `PulseCatalogProductEndpoint`.
 */
export class CatalogProductEndpoint extends Endpoint {

    public async getByCatalog(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<CatalogProduct>> {
        const queryString: QueryString = new QueryString(path('/catalogs/:catalogId/products', {catalogId: catalogId.toString()}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, CatalogProduct.parse);
    }

    /** The product with this catalog identifier, or null. */
    public async getByIdentifier(catalogId: CatalogId | string, identifier: string): Promise<CatalogProduct | null> {
        const queryString: QueryString = new QueryString(path('/catalogs/:catalogId/products', {catalogId: catalogId.toString()}));
        queryString.set('identifier', identifier);

        const result: CollectionResult<CatalogProduct> = await this.requestCollection(queryString, CatalogProduct.parse);
        const products: CatalogProduct[] = result.getData();

        return products.length > 0 ? products[0] : null;
    }

    /**
     * Assign a vendor product to the catalog. The API refuses an identifier the catalog already has
     * ("already exist"), so an import that lost the answer to an earlier create reads it back instead.
     */
    public async create(product: CatalogProduct): Promise<CatalogProduct> {
        if (product.vendorProductId === null) {
            throw new Error('Unable to create catalog product `' + product.identifier + '`: it has no vendor product');
        }
        const result: ObjectResult<CatalogProduct> = await this.requestObject(
            path('/catalogs/:catalogId/products', {catalogId: product.catalogId.toString()}),
            {_formatted: true, identifier: product.identifier, vendor_product: product.vendorProductId, cost_price: product.costPrice},
            CatalogProduct.parse,
            'POST',
        );
        const created: CatalogProduct | null = result.getData();
        if (created === null) {
            throw new Error('Unable to create catalog product `' + product.identifier + '`: the API returned nothing');
        }
        return created;
    }

    /** Update what the catalog itself holds about the product — today only the cost price. */
    public async update(product: CatalogProduct): Promise<void> {
        // Already in wire shape, as in VendorProductEndpoint.update.
        const operations: object[] = Object.assign([{op: 'add', path: 'cost_price', value: product.costPrice}], {_formatted: true});
        await this.requestObject(
            path('/catalogs/:catalogId/products/:catalogProductId', {catalogId: product.catalogId.toString(), catalogProductId: product.id}),
            operations,
            (raw: unknown): unknown => raw,
            'PATCH',
        );
    }
}
