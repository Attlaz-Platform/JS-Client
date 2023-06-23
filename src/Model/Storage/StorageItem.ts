import {Utils} from '../../Utils.js';

export class StorageItem {
    public key: string;
    public bytes: number;
    public value: string | number | boolean | null | any;
    public expiration: Date | null;

    public static parse(raw: any): StorageItem {
        let storageItem: StorageItem = new StorageItem();
        storageItem.key = raw.key;
        storageItem.bytes = raw.bytes;
        storageItem.value = raw.value;
        storageItem.expiration = raw.expiration === null ? null : Utils.parseRawDate(raw.expiration);
        return storageItem;
    }
}
