import {Endpoint, StorageType} from "..";

export class StorageEndpoint extends Endpoint {
    public async getPoolKeys(projectEnvironmentId: number, storageType: StorageType): Promise<string[]> {
        return []
    }

    public async getItemKeys(projectEnvironmentId: number, storageType: StorageType, poolKey: string): Promise<string[]> {
        return []
    }
}
