/** Narrows the review queue. Omitting `statuses` returns the pending ones. */
export type ReviewMatchFilters = {
    statuses?: string[];
    competitor?: string;
    gtin?: string;
    search?: string;
};
