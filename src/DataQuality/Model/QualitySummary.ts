import {QualityCodeSummaryRow} from './QualityCodeSummaryRow.js';
import {QualitySummaryRow} from './QualitySummaryRow.js';

/** Both groupings returned by the summary endpoint. */
export type QualitySummary = {
    counts: QualitySummaryRow[];
    codes: QualityCodeSummaryRow[];
};
