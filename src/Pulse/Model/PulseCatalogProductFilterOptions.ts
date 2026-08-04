/** The values the product list can currently be filtered on. */
export type PulseCatalogProductFilterOptions = {
    brands: string[];
    categories: string[];
    productGroups: {id: string; name: string}[];
    tags: Record<string, string[]>;
};
