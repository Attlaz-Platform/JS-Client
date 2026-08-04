import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
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
        const queryString: QueryString = new QueryString('/catalogs/' + catalogId.toString() + '/products');
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, CatalogProduct.parse);
    }

    /** The product with this catalog identifier, or null. */
    public async getByIdentifier(catalogId: CatalogId | string, identifier: string): Promise<CatalogProduct | null> {
        const queryString: QueryString = new QueryString('/catalogs/' + catalogId.toString() + '/products');
        queryString.set('identifier', identifier);

        const result: CollectionResult<CatalogProduct> = await this.requestCollection(queryString, CatalogProduct.parse);
        const products: CatalogProduct[] = result.getData();

        return products.length > 0 ? products[0] : null;
    }
}
