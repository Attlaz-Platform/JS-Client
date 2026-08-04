/** Narrows the entity list; every field is optional and omitted filters are not sent. */
export type QualityEntityFilters = {
    entityType?: string | null;
    status?: string | null;
    severity?: string | null;
    property?: string | null;
    code?: string | null;
    /** Only entities carrying a problem first seen after this moment ("what appeared since…"). */
    newSince?: Date | null;
};
