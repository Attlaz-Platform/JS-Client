import {Utils} from '../../Utils.js';

export class StorageItem {
    // public id: string | null = null;
    public key: string;
    public bytes: number;

    public created: Date | null;
    public updated: Date | null;
    public expiration: Date | null;

    public value: string | number | boolean | null | any;

    public static parse(raw: any): StorageItem {
        const storageItem: StorageItem = new StorageItem();
        // storageItem.id = raw.id === null || raw.id === undefined ? null : raw.id;
        storageItem.key = raw.key;
        storageItem.bytes = raw.bytes;
        storageItem.value = raw.value;
        storageItem.created = raw.created === null ? null : Utils.parseRawDate(raw.created);
        storageItem.updated = raw.updated === null ? null : Utils.parseRawDate(raw.updated);
        storageItem.expiration = raw.expiration === null ? null : Utils.parseRawDate(raw.expiration);
        return storageItem;
    }
}
