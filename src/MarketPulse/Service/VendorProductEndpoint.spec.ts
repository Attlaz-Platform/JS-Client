import {VendorProduct} from '../Model/VendorProduct.js';
import {VendorProductEndpoint} from './VendorProductEndpoint.js';
import {ITransport} from '../../Http/Transport/ITransport.js';

/**
 * Guards that every field on VendorProduct actually reaches the wire.
 *
 * `variant_axes` shipped in `save` and in `parse` but was missing from `update`, so an import that
 * upserts wrote it only for products that did not exist yet — silently, for a whole catalog. Nothing
 * typed catches that: a forgotten patch operation is well-formed code.
 *
 * Matching is on VALUES, not key names: the base Endpoint rewrites keys on the way out
 * (`originalPrice` -> `original_price`), so a name-based check would have to reimplement that.
 * Every field therefore gets a distinct value below, and the assertion is simply that the value
 * turns up in what was sent. Comparison is by equality rather than identity because that rewrite
 * rebuilds nested objects rather than passing the original reference through.
 */

type Sent = {action: string; parameters: any; method: string};

/** Records what the endpoint would send, and answers with a canned response. */
function recordingTransport(response: unknown = {}): {transport: ITransport; sent: Sent[]} {
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

/** Every field set, each to a value no other field uses, so one field cannot stand in for another. */
function filledProduct(): VendorProduct {
    const product: VendorProduct = new VendorProduct('VENDOR1', 'IDENTIFIER1');
    product.id = 'ID1';
    product.name = 'NAME1';
    product.image = 'IMAGE1';
    product.gtin = 'GTIN1';
    product.brand = 'BRAND1';
    product.url = 'URL1';
    product.sku = 'SKU1';
    product.manufacturerPartNumber = 'MPN1';
    product.variantGroup = 'GROUP1';
    product.variantAxes = [{name: 'Colour', value: 'Jet Black'}];
    product.currency = 'EUR';
    product.price = 101;
    product.originalPrice = 102;
    product.shippingCost = 103;
    product.stockStatus = 'in_stock';
    product.properties = {material: 'steel'};
    product.createdAt = new Date('2026-01-01T00:00:00.000Z');
    product.updatedAt = new Date('2026-01-02T00:00:00.000Z');

    return product;
}

/** Fields that legitimately never appear in a request body, and why. */
const NOT_SENT: {save: string[]; update: string[]} = {
    // `vendorId` is a path parameter; the rest are assigned by the API.
    save: ['id', 'vendorId', 'createdAt', 'updatedAt'],
    // Same, plus: `id` is in the URL, and `identifier` is the upsert key, so it is not patchable.
    update: ['id', 'vendorId', 'identifier', 'createdAt', 'updatedAt'],
};

function fieldsOf(product: VendorProduct): string[] {
    return Object.keys(product);
}

describe('VendorProductEndpoint carries every field', () => {
    test('save sends every field the API owns', async () => {
        const {transport, sent} = recordingTransport({id: 'ID1', vendor: 'VENDOR1', identifier: 'IDENTIFIER1'});
        const product: VendorProduct = filledProduct();

        await new VendorProductEndpoint(transport).save(product);

        const sentValues: unknown[] = Object.values(sent[0]!.parameters);
        for (const field of fieldsOf(product)) {
            if (NOT_SENT.save.includes(field)) {
                continue;
            }
            expect(sentValues, `save() does not send \`${field}\``).toContainEqual((product as any)[field]);
        }
    });

    test('update sends every mutable field', async () => {
        const {transport, sent} = recordingTransport({});
        const product: VendorProduct = filledProduct();

        await new VendorProductEndpoint(transport).update(product);

        const patched: unknown[] = (sent[0]!.parameters as {value: unknown}[]).map(operation => operation.value);
        for (const field of fieldsOf(product)) {
            if (NOT_SENT.update.includes(field)) {
                continue;
            }
            expect(patched, `update() does not patch \`${field}\``).toContainEqual((product as any)[field]);
        }
    });

    /**
     * `properties` keys are a competitor's own specification labels and `variant_axes` carries
     * `numericValue`. The key formatter would rewrite both — `EAN` became `_e_a_n` — so these two
     * bodies are sent verbatim, and the marker itself must not reach the API.
     */
    test.each([
        ['save', async (endpoint: VendorProductEndpoint, product: VendorProduct) => await endpoint.save(product)],
        ['update', async (endpoint: VendorProductEndpoint, product: VendorProduct) => await endpoint.update(product)],
    ])('%s does not rewrite the keys inside an opaque payload', async (_name: string, call: (endpoint: VendorProductEndpoint, product: VendorProduct) => Promise<unknown>) => {
        const {transport, sent} = recordingTransport({id: 'ID1', vendor: 'VENDOR1', identifier: 'IDENTIFIER1'});
        const product: VendorProduct = filledProduct();
        product.properties = {'Colour temperature (Kelvin)': '2700K', EAN: '5411234567890'};
        product.variantAxes = [{name: 'Colour', value: 'Jet Black', numericValue: 2700}];

        await call(new VendorProductEndpoint(transport), product);

        const body: string = JSON.stringify(sent[0]!.parameters);
        expect(body).toContain('Colour temperature (Kelvin)');
        expect(body).toContain('EAN');
        expect(body).toContain('numericValue');
        expect(body).not.toContain('_formatted');
    });

    /**
     * The reverse direction. A field the API returns but `fill` forgets stays at its default, so
     * asserting nothing is left at a default catches an unparsed field without naming them twice.
     */
    test('parse fills every field from a complete response', () => {
        const product: VendorProduct = VendorProduct.parse({
            id: 'ID1',
            vendor: 'VENDOR1',
            identifier: 'IDENTIFIER1',
            name: 'NAME1',
            image: 'IMAGE1',
            gtin: 'GTIN1',
            brand: 'BRAND1',
            url: 'URL1',
            sku: 'SKU1',
            manufacturer_part_number: 'MPN1',
            variant_group: 'GROUP1',
            variant_axes: [{name: 'Colour', value: 'Jet Black'}],
            currency: 'EUR',
            price: 101,
            original_price: 102,
            shipping_cost: 103,
            stock_status: 'in_stock',
            properties: {material: 'steel'},
            created_at: '2026-01-01T00:00:00.000Z',
            updated_at: '2026-01-02T00:00:00.000Z',
        });

        for (const field of fieldsOf(product)) {
            expect((product as any)[field], `parse() leaves \`${field}\` unset`).not.toBeNull();
        }
        expect(product.stockStatus, 'parse() leaves `stockStatus` unset').not.toBe('unknown');
    });
});
