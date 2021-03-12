import {DataResult, Endpoint, Storage, StorageType} from '..';

export class StorageEndpoint extends Endpoint {

    public async getStorage(projectEnvironmentId: string, storageType: StorageType): Promise<DataResult<Storage>> {
        const result: DataResult<Storage> = new DataResult<Storage>()
        switch (storageType) {
            case StorageType.Vault:
                result.setData({name: '', type: storageType, pools: ['default'], size_current: 0, size_total: 512 * 1024});
                break;
            case StorageType.Persistent:
                result.setData({name: '', type: storageType, pools: ['default'], size_current: Math.random() * 1024 * 1024, size_total: 1 * 1024 * 1024 * 1024});
                break;
            case StorageType.Cache:
                result.setData({name: '', type: storageType, pools: ['default'], size_current: 20 * 1024 * 1024, size_total: 1024 * 1024 * 1024});
                break;
            case StorageType.Workers:
                result.setData({name: '', type: storageType, pools: ['default'], size_current: 259 * 1024 * 1024, size_total: 512 * 1024 * 1024});
                break;
        }

        return result;
    }

    // public async getPoolKeys(projectEnvironmentId: number, storageType: StorageType): Promise<string[]> {
    //     return ['default']
    // }

    public async getItemKeys(projectEnvironmentId: string, storageType: StorageType, poolKey: string): Promise<string[]> {
        return ['item1', 'item2', 'item3']
    }
}

