import {MatchHistoryBucket} from './MatchHistoryBucket.js';
import {MatchHistoryInterval} from './MatchHistoryInterval.js';

/** A match-history series plus where the queue stands right now. */
export type MatchHistory = {
    interval: MatchHistoryInterval;
    buckets: MatchHistoryBucket[];
    snapshot: {pending: number; accepted: number; declined: number};
};
