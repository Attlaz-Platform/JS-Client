import {FilterOperator} from './FilterOperator.js';

export type FilterPrimitive = string | number | boolean | null;
export type FilterValue = FilterPrimitive | FilterPrimitive[];

export interface AndFilterNode {
    and: FilterNode[];
}

export interface OrFilterNode {
    or: FilterNode[];
}

export interface NotFilterNode {
    not: FilterNode;
}

export interface CompareFilterNode {
    field: string;
    op: FilterOperator;
    value: FilterValue;
}

export type FilterNode = AndFilterNode | OrFilterNode | NotFilterNode | CompareFilterNode;
