import {ObservedState} from './ObservedState.js';

/** Kept apart from the counters: a faulted queue with nothing on it looks exactly like an idle one. */
export type QueueCondition = 'ok' | 'faulted' | 'unknown';

export class QueueStatus {
    /** Identity of what was observed, so a stored status is readable without the query behind it. */
    public name: string | null = null;

    public state: ObservedState;
    /** Null unless `state` is 'present'. */
    public condition: QueueCondition | null = null;

    /** Queued, not yet taken. */
    public messages_waiting: number = 0;
    /** Taken by a runner, not yet acknowledged. */
    public messages_processing: number = 0;

    public messages_arriving_per_second: number = 0;
    /** Acknowledgements — work finished, not merely handed out. */
    public messages_completed_per_second: number = 0;
    /** Redeliveries: a runner died mid-job. A failed flow run is recorded elsewhere; this is not. */
    public messages_retried_per_second: number = 0;

    /** Compared against the pool's ready count. */
    public consumers: number = 0;

    /**
     * Once stored this is the FIRST time the value was seen: `isEqual` blanks it, and an unchanged
     * status only bumps the row's `updated_at`. That is "last confirmed"; this is "unchanged since".
     */
    public observed_at: Date;
}
