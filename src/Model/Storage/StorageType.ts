import {Utils} from '../../Utils';

export enum StorageType {
    Cache = 'cache' as any,
    Persistent = 'persistent' as any,
    Vault = 'vault' as any,
}

export namespace StorageType {
    export function fromString(input: string): StorageType {
        const result: StorageType = Utils.parseEnum<StorageType>(input, StorageType);
        if (Utils.isNullOrUndefined(result)) {
            throw new Error('Unable to parse StorageType from string: Unknown StorageType "' + input + '"');
        }
        return result;
    }
}
