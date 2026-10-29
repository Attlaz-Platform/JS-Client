import {PositionBucket} from './PositionBucket.js';

/** Simple narrowing of the product list; `tags` filters on materialised tag values. */
export type PulseCatalogProductFilters = {
    brand?: string;
    category?: string;
    search?: string;
    productGroup?: string;
    tags?: Record<string, string>;
    positionBucket?: PositionBucket;
    // Also return the unconfirmed (pending) suggestions next to the counted matches.
    includePending?: boolean;
};
