import {ObservedState} from './ObservedState.js';

/**
 * The counts cannot express this: a new runner that never becomes ready leaves the old ones
 * serving, so `desired` and `ready` still agree while the deploy has failed.
 */
export type RunnerRollout = 'settled' | 'in_progress' | 'failed';

/**
 * A pool has four rungs — configured min/max → `desired` → `ready` → the queue's `consumers` — and
 * each gap means something different. The last lives on QueueStatus, so "how many runners are busy"
 * needs both.
 */
export class RunnersStatus {
    /** Runners are found by label, so this is the only record of which deployment answered. */
    public name: string | null = null;

    public state: ObservedState;

    /** What the deployment asks for, not what the pool is configured for. Differing means it was
     * never redeployed. */
    public desired: number;
    public ready: number;

    public rollout: RunnerRollout;

    /** For drift against the configured image. */
    public image: string | null;

    /**
     * A pool restarting every two minutes still reports ready = 2 of 2. The count alone cannot say
     * whether that is happening now, which is what `last_restart_at` answers.
     */
    public restarts: number | null;
    public last_restart_at: Date | null;

    /** Millicores, matching the unit the configuration uses. */
    public cpu_limit_millicores: number | null;
    public memory_limit_bytes: number | null;

    /** First-seen once stored — see QueueStatus.observed_at. */
    public observed_at: Date;
}
