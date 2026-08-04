import {QualityEntityProblemSuppression} from './QualityEntityProblemSuppression.js';

/** What a new suppression did: the record itself, plus how many open problems it muted. */
export type QualityEntityProblemSuppressionResult = {
    suppression: QualityEntityProblemSuppression | null;
    muted: number;
};
