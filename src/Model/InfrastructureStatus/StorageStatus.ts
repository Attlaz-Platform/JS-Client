type StorageTypeStatus = { exists: boolean; used: number; limit: number; };

export class StorageStatus {
    public persistent: StorageTypeStatus;
    public cache: StorageTypeStatus;
    public vault: StorageTypeStatus;
    public infrastructure: StorageTypeStatus;

    public updated: Date;
}


