import {Utils} from '../../Utils.js';

export class StorageItemInformation {
    public key: string;
    public bytes: number;
    public expiration: Date | null;

    public static parse(raw: any): StorageItemInformation {
        let storageItemInformation: StorageItemInformation = new StorageItemInformation();
        storageItemInformation.key = raw.key;
        storageItemInformation.bytes = raw.bytes;
        storageItemInformation.expiration = raw.expiration === null ? null : Utils.parseRawDate(raw.expiration);
        return storageItemInformation;
    }
}
