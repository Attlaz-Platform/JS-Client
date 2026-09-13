/**
 * Whether we could see a thing, not whether it is well — verdicts live in `health_alert`.
 * Conflating `missing` (we asked, it is not there) with `unreachable` (we could not ask) reported
 * a live queue as deleted whenever the broker call failed.
 */
export type ObservedState = 'present' | 'missing' | 'unreachable';
