import {ITransport} from '../../Http/Transport/ITransport.js';
import {CatalogId} from '../Model/CatalogId.js';
import {CatalogProduct} from '../Model/CatalogProduct.js';
import {CatalogProductEndpoint} from './CatalogProductEndpoint.js';

type Sent = {action: string; parameters: any; method: string};

/** Records what the endpoint would send, and answers with a canned response. */
function recordingTransport(response: unknown): {transport: ITransport; sent: Sent[]} {
    const sent: Sent[] = [];
    const transport = {
        isDebugEnabled: (): boolean => false,
        reportParseError: (): void => undefined,
        request: async (action: string, parameters: any, method: string): Promise<unknown> => {
            sent.push({action, parameters, method});
            return response;
        },
    } as unknown as ITransport;

    return {transport, sent};
}

function product(): CatalogProduct {
    const catalogProduct: CatalogProduct = new CatalogProduct('CP1', new CatalogId('2sOQDlHDo69zkwRDp0EnD5qfxDe'), 'SKU-1');
    catalogProduct.vendorProductId = 'VP1';
    catalogProduct.costPrice = 12.1;
    return catalogProduct;
}

const STORED = {id: 'CP1', catalog: '2sOQDlHDo69zkwRDp0EnD5qfxDe', identifier: 'SKU-1', vendor_product: 'VP1', cost_price: 12.1};

describe('CatalogProductEndpoint', () => {
    test('create sends the identifier, vendor product and cost price, and returns the stored product', async () => {
        const {transport, sent} = recordingTransport(STORED);

        const created: CatalogProduct = await new CatalogProductEndpoint(transport).create(product());

        expect(sent).toHaveLength(1);
        expect(sent[0].method).toBe('POST');
        expect(sent[0].action).toBe('/catalogs/2sOQDlHDo69zkwRDp0EnD5qfxDe/products');
        expect(sent[0].parameters).toMatchObject({identifier: 'SKU-1', vendor_product: 'VP1', cost_price: 12.1});
        expect(created.id).toBe('CP1');
        expect(created.vendorProductId).toBe('VP1');
    });

    test('create refuses a product without a vendor product rather than sending one the API rejects', async () => {
        const {transport, sent} = recordingTransport(STORED);
        const withoutVendorProduct: CatalogProduct = product();
        withoutVendorProduct.vendorProductId = null;

        await expect(new CatalogProductEndpoint(transport).create(withoutVendorProduct)).rejects.toThrow('has no vendor product');
        expect(sent).toHaveLength(0);
    });

    test('update patches the cost price, including clearing it', async () => {
        const {transport, sent} = recordingTransport(STORED);
        const cleared: CatalogProduct = product();
        cleared.costPrice = null;

        await new CatalogProductEndpoint(transport).update(cleared);

        expect(sent[0].method).toBe('PATCH');
        expect(sent[0].action).toBe('/catalogs/2sOQDlHDo69zkwRDp0EnD5qfxDe/products/CP1');
        expect([...sent[0].parameters]).toEqual([{op: 'add', path: 'cost_price', value: null}]);
    });
});
