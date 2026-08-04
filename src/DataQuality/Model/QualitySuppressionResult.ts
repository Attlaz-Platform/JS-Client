import {QualitySuppression} from './QualitySuppression.js';

/** What a new suppression did: the record itself, plus how many open problems it muted. */
export type QualitySuppressionResult = {
    suppression: QualitySuppression | null;
    muted: number;
};
