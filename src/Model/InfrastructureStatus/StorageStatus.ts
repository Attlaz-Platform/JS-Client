import {ObservedState} from './ObservedState.js';

type StorageTypeStatus = {
    /** Never 'missing' — storage is created on first use. Separates empty from unreadable. */
    state: ObservedState;
    used_bytes: number;
    items: number;
    // null = explicitly unlimited at some scope in the chain. Distinct from a missing
    // configuration row (which throws upstream in getStorageBytesLimit).
    limit_bytes: number | null;
};

export class StorageStatus {
    public persistent: StorageTypeStatus;
    public cache: StorageTypeStatus;
    public vault: StorageTypeStatus;
    public infrastructure: StorageTypeStatus;

    /** First-seen once stored — see QueueStatus.observed_at. */
    public observed_at: Date;
}
