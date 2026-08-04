/** Simple narrowing of the product list; `tags` filters on materialised tag values. */
export type PulseCatalogProductFilters = {
    brand?: string;
    category?: string;
    search?: string;
    productGroup?: string;
    tags?: Record<string, string>;
};
