/**
 * One row of the per-code summary, joined to the problem definition — the input for the
 * "what should I fix next" cards. Already ordered blocking first, then severity, then count.
 *
 * `blocking` and `severity` are orthogonal: severity is how bad the problem is, blocking is whether
 * the entity can ship at all.
 */
export type QualityCodeSummaryRow = {
    code: string;
    count: number;
    worstSeverity: string;
    label: string | null;
    description: string | null;
    blocking: boolean;
    helpUrl: string | null;
};
