/**
 * Whether a vendor product is purchasable. Three states rather than a nullable boolean, because
 * "we don't know" is a different fact from "it is out of stock" — most crawlers never report stock.
 *
 * Duplicated from apps-lib rather than imported, per the client's enum-duplication convention: the
 * client must not depend on a server package.
 */
export type StockStatus = 'in_stock' | 'out_of_stock' | 'unknown';

/**
 * Read `stock_status` from an API record. An unrecognised or absent value is `unknown`, never
 * `out_of_stock` — guessing the latter would make a consumer hide a product that is probably on sale.
 */
export const parseStockStatus = (status: unknown): StockStatus => {
    if (status === 'in_stock' || status === 'out_of_stock' || status === 'unknown') {
        return status;
    }
    return 'unknown';
};

/**
 * Convert a scraper's own boolean reading of stock into a status. Separate from parseStockStatus:
 * that one reads the wire, this one is for callers holding a `boolean | null` of their own, where
 * null genuinely means the source did not say.
 */
export const stockStatusFromBoolean = (inStock: boolean | null): StockStatus => {
    if (inStock === null) {
        return 'unknown';
    }
    return inStock ? 'in_stock' : 'out_of_stock';
};
