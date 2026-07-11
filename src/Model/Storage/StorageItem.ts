import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class StorageItem {
    // public id: string | null = null;
    public key: string;
    public bytes: number;

    public created: Date | null;
    public updated: Date | null;
    public expiration: Date | null;

    public value: string | number | boolean | null | any;

    public static parse(raw: ApiRecord): StorageItem {
        const storageItem: StorageItem = new StorageItem();
        // storageItem.id = raw.id === null || raw.id === undefined ? null : raw.id;
        storageItem.key = raw.key as string;
        storageItem.bytes = raw.bytes as number;
        storageItem.value = raw.value;
        storageItem.created = raw.created === null ? null : Utils.parseRawDate(raw.created as Date);
        storageItem.updated = raw.updated === null ? null : Utils.parseRawDate(raw.updated as Date);
        storageItem.expiration = raw.expiration === null ? null : Utils.parseRawDate(raw.expiration as Date);
        return storageItem;
    }
}
