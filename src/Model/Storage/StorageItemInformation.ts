import {Utils} from '../../Utils.js';

export class StorageItemInformation {
    public id: string;
    public key: string;
    public bytes: number;
    public created: Date | null;
    public updated: Date | null;
    public expiration: Date | null;

    public static parse(raw: any): StorageItemInformation {
        const storageItemInformation: StorageItemInformation = new StorageItemInformation();
        storageItemInformation.id = raw.id;
        storageItemInformation.key = raw.key;
        storageItemInformation.bytes = raw.bytes;
        storageItemInformation.created = raw.expiration === null ? null : Utils.parseRawDate(raw.created);
        storageItemInformation.updated = raw.expiration === null ? null : Utils.parseRawDate(raw.updated);
        storageItemInformation.expiration = raw.expiration === null ? null : Utils.parseRawDate(raw.expiration);
        return storageItemInformation;
    }
}
