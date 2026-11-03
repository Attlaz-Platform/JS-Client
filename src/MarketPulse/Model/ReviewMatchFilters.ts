import {MatchDecisionSource} from './MatchDecisionSource.js';

/** Unknown confidence sorts last in both confidence orders. */
export type ReviewMatchOrder = 'newest' | 'confidence_desc' | 'confidence_asc';

/**
 * Narrows the review queue. Omitting `statuses` returns the pending ones. `competitor`, `gtin` and
 * `search` apply to the competitor product; `ownSearch` matches your own product's name, GTIN or SKU.
 */
export type ReviewMatchFilters = {
    statuses?: string[];
    decisionSources?: MatchDecisionSource[];
    competitor?: string;
    gtin?: string;
    search?: string;
    ownSearch?: string;
    order?: ReviewMatchOrder;
};
