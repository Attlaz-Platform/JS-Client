export type FilterOperator =
    | 'eq' | 'neq'
    | 'in' | 'not_in'
    | 'lt' | 'lte' | 'gt' | 'gte'
    | 'is_null' | 'is_not_null'
    | 'starts_with' | 'ends_with' | 'contains';
