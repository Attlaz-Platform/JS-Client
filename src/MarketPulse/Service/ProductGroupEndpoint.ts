import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {ProductGroup} from '../Model/ProductGroup.js';
import {ProductGroupData} from '../Model/ProductGroupData.js';

/** Product groups — `/pulse/catalogs/:catalogId/product-groups`. */
export class ProductGroupEndpoint extends Endpoint {

    public async getByCatalog(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<ProductGroup>> {
        const queryString: QueryString = new QueryString('/pulse/catalogs/' + catalogId.toString() + '/product-groups');
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, ProductGroup.parse);
    }

    public async getById(productGroupId: string): Promise<ProductGroup | null> {
        const result: ObjectResult<ProductGroup> = await this.requestObject(
            '/pulse/product-groups/' + productGroupId,
            null,
            ProductGroup.parse,
            'GET',
        );

        return result.getData();
    }

    public async create(catalogId: CatalogId | string, data: ProductGroupData): Promise<ProductGroup | null> {
        const result: ObjectResult<ProductGroup> = await this.requestObject(
            '/pulse/catalogs/' + catalogId.toString() + '/product-groups',
            data,
            ProductGroup.parse,
            'POST',
        );

        return result.getData();
    }
}
