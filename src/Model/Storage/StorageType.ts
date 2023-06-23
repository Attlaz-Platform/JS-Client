import {Utils} from '../../Utils.js';

export enum StorageType {
    Cache = 'cache',
    Persistent = 'persistent',
    Vault = 'vault',
    Infrastructure = 'infrastructure'
}

export namespace StorageType {
    export function fromString(input: string): StorageType {
        const result: StorageType | null = Utils.parseEnum<StorageType>(input, StorageType);
        if (result === null) {
            throw new Error('Unable to parse StorageType from string: Unknown StorageType "' + input + '"');
        }
        return result;
    }
}
