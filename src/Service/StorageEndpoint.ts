import {Endpoint} from './Endpoint';
import {DataResult} from '../Model/Result/DataResult';
import {StorageType} from '../Model/Storage/StorageType';
import {StorageInformation} from '../Model/Storage/StorageInformation';
import {StorageItem} from '../Model/Storage/StorageItem';
import {StorageItemInformation} from '../Model/Storage/StorageItemInformation';

export class StorageEndpoint extends Endpoint {

    public async getInformation(projectEnvironmentId: string, storageType: StorageType): Promise<DataResult<StorageInformation>> {

        let cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType;

        try {
            const result: DataResult<StorageInformation> = await this.request(cmd, null, 'GET');
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }

    }

    public async clearPool(projectEnvironmentId: string, storageType: StorageType, poolKey: string): Promise<DataResult<any>> {
        let cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey;

        try {
            const result: DataResult<void> = await this.request(cmd, null, 'DELETE');
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    public async getPoolItemsInformation(projectEnvironmentId: string, storageType: StorageType, poolKey: string): Promise<DataResult<StorageItemInformation[]>> {
        let cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items';

        try {
            const result: DataResult<StorageItemInformation[]> = await this.request(cmd, null, 'GET');
            result.setData(this.parseCollection(result, StorageItemInformation.parse));
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    public async getItem(projectEnvironmentId: string, storageType: StorageType, poolKey: string, storageItemKey: string): Promise<StorageItem | null> {
        let cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items/' + storageItemKey;

        try {
            const result: DataResult<StorageItem> = await this.request(cmd, null, 'GET');
            if (!result.hasData()) {
                return null;
            }

            return StorageItem.parse(result.getData());

        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage item', ex);
            }

            throw ex;
        }
    }

    public async setItem(projectEnvironmentId: string, storageType: StorageType, poolKey: string, storageItem: StorageItem): Promise<void> {
        let cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items/' + storageItem.key;

        try {
            const result: DataResult<StorageItem> = await this.request(cmd, {'storage_item': storageItem}, 'POST');
            return;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    public async deleteItem(projectEnvironmentId: string, storageType: StorageType, poolKey: string, storageItemKey: string) {
        let cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items/' + storageItemKey;

        try {
            const result: DataResult<StorageItem> = await this.request(cmd, null, 'DELETE');
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }
}

