// null = explicitly unlimited at some scope in the chain.
type StorageTypeStatus = { exists: boolean; used: number; limit: number | null; };

export class StorageStatus {
    public persistent: StorageTypeStatus;
    public cache: StorageTypeStatus;
    public vault: StorageTypeStatus;
    public infrastructure: StorageTypeStatus;

    public updated: Date;
}


