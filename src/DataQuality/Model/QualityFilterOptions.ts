import {QualityCodeOption} from './QualityCodeOption.js';

/** The values the entity list can be filtered on, for the dataset as it currently stands. */
export type QualityFilterOptions = {
    entityTypes: string[];
    properties: string[];
    codes: QualityCodeOption[];
};
