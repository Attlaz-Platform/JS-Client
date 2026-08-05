/** Matches discovered and reviewed within one bucket of the history. */
export type MatchHistoryBucket = {
    date: Date;
    discovered: number;
    manualAccepted: number;
    manualDeclined: number;
};
