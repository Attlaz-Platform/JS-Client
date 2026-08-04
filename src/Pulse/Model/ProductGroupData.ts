import {ProductGroupType} from './ProductGroup.js';

/** Fields accepted when writing a group; camelCase keys are snake_cased by the base Endpoint. */
export type ProductGroupData = {
    name: string;
    description?: string | null;
    groupType?: ProductGroupType;
    criteria?: Record<string, unknown>;
};
