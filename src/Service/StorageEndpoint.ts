import {Endpoint} from './Endpoint.js';
import {StorageType} from '../Model/Storage/StorageType.js';
import {StorageInformation} from '../Model/Storage/StorageInformation.js';
import {StorageItem} from '../Model/Storage/StorageItem.js';
import {StorageItemInformation} from '../Model/Storage/StorageItemInformation.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

export class StorageEndpoint extends Endpoint {
    public async getInformation(projectEnvironmentId: string, storageType: StorageType): Promise<StorageInformation | null> {
        const cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType;

        try {
            const parser = (raw: any): StorageInformation => {
                const storageInformation: StorageInformation = new StorageInformation();
                storageInformation.bytes = raw.bytes;
                storageInformation.bytes_limit = raw.bytes_limit;
                storageInformation.items = raw.items;
                storageInformation.pools = raw.pools;

                return storageInformation;
            };
            const result: ObjectResult<StorageInformation> = await this.requestObject(cmd, null, parser, 'GET');
            return result.getData();
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    public async clearPool(projectEnvironmentId: string, storageType: StorageType, poolKey: string): Promise<boolean> {
        const cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey;

        try {
            const parser = (raw: any): { deleted: boolean } => raw.deleted;
            const result: ObjectResult<{ deleted: boolean }> = await this.requestObject(cmd, null, parser, 'DELETE');

            const re: { deleted: boolean } | null = result.getData();
            if (re === null) {
                console.log('clearpool wrong data', {result, parsed: re});
                throw new Error('Unable to clear storage pool: wrong response from API');
            }
            return re.deleted;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    public async getPoolItemsInformation(projectEnvironmentId: string, storageType: StorageType, poolKey: string): Promise<CollectionResult<StorageItemInformation>> {
        const cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items';

        try {
            const result: CollectionResult<StorageItemInformation> = await this.requestCollection(cmd, StorageItemInformation.parse, null, 'GET');
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    public async getItem(projectEnvironmentId: string, storageType: StorageType, poolKey: string, storageItemKey: string): Promise<StorageItem | null> {
        const cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items/' + storageItemKey;

        try {
            const result: ObjectResult<StorageItem> = await this.requestObject(cmd, null, StorageItem.parse, 'GET');

            return result.getData();
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage item', ex);
            }

            throw ex;
        }
    }

    public async setItem(projectEnvironmentId: string, storageType: StorageType, poolKey: string, storageItem: StorageItem): Promise<StorageItem> {
        const cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items/' + storageItem.key;

        try {
            const result: ObjectResult<StorageItem> = await this.requestObject(cmd, storageItem, StorageItem.parse, 'POST');

            const savedItem: StorageItem | null = result.getData();
            if (savedItem === null) {
                console.log('Storage set item wrong data', {result, parsed: savedItem});
                throw new Error('Unable to save storage item: wrong response from API');
            }

            return savedItem;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    public async deleteItem(projectEnvironmentId: string, storageType: StorageType, poolKey: string, storageItemKey: string): Promise<boolean> {
        const cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType + '/' + poolKey + '/items/' + storageItemKey;

        try {
            const parser = (raw: any): { deleted: boolean } => ({deleted: raw.deleted});
            const result: ObjectResult<{ deleted: boolean }> = await this.requestObject(cmd, null, parser, 'DELETE');
            const x: { deleted: boolean } | null = result.getData();
            if (x === null) {
                console.log('Storage delete item wrong data', {result, parsed: x});
                throw new Error('Unable to delete storage item: wrong response from API');
            }
            return x.deleted;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }
}
