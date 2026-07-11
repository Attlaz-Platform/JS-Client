import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class StorageItemInformation {
    // public id: string | null = null;
    public key: string;
    public bytes: number;
    public created: Date | null;
    public updated: Date | null;
    public expiration: Date | null;

    public static parse(raw: ApiRecord): StorageItemInformation {
        const storageItemInformation: StorageItemInformation = new StorageItemInformation();
        // storageItemInformation.id = raw.id;
        storageItemInformation.key = raw.key as string;
        storageItemInformation.bytes = raw.bytes as number;
        storageItemInformation.created = raw.created === null ? null : Utils.parseRawDate(raw.created as Date);
        storageItemInformation.updated = raw.updated === null ? null : Utils.parseRawDate(raw.updated as Date);
        storageItemInformation.expiration = raw.expiration === null ? null : Utils.parseRawDate(raw.expiration as Date);
        return storageItemInformation;
    }
}
