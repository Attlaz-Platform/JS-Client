import {path} from '../Http/Data/Path.js';
import {StorageType} from '../Model/Storage/StorageType.js';
import {StorageInformation} from '../Model/Storage/StorageInformation.js';
import {StorageItem} from '../Model/Storage/StorageItem.js';
import {StorageItemInformation} from '../Model/Storage/StorageItemInformation.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {Endpoint} from './Endpoint.js';

export class StorageEndpoint extends Endpoint {
    public async getInformation(projectEnvironmentId: string, storageType: StorageType): Promise<StorageInformation | null> {
        const cmd: string = path('/projectenvironments/:projectEnvironmentId/storage/:storageType', {projectEnvironmentId, storageType});

        try {
            const parser = (raw: Record<string, unknown>): StorageInformation => {
                const storageInformation: StorageInformation = new StorageInformation();
                storageInformation.bytes = raw.bytes as number;
                storageInformation.bytes_limit = raw.bytes_limit as number | null;
                storageInformation.items = raw.items as number;
                // Prefer the new `buckets` field; fall back to the legacy `pools` for older API responses.
                storageInformation.buckets = (raw.buckets ?? raw.pools) as any;

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

    public async clearBucket(projectEnvironmentId: string, storageType: StorageType, bucketKey: string): Promise<boolean> {
        const cmd: string = path('/projectenvironments/:projectEnvironmentId/storage/:storageType/:bucketKey', {projectEnvironmentId, storageType, bucketKey});

        try {
            const parser = (raw: any): { deleted: boolean } => raw.deleted;
            const result: ObjectResult<{ deleted: boolean }> = await this.requestObject(cmd, null, parser, 'DELETE');

            const re: { deleted: boolean } | null = result.getData();
            if (re === null) {
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

    public async getBucketItemsInformation(projectEnvironmentId: string, storageType: StorageType, bucketKey: string, pagination: CursorPagination | null = null): Promise<CollectionResult<StorageItemInformation>> {
        const qs: QueryString = new QueryString(path('/projectenvironments/:projectEnvironmentId/storage/:storageType/:bucketKey/items', {projectEnvironmentId, storageType, bucketKey}));
        qs.addPagination(pagination);


        try {
            const result: CollectionResult<StorageItemInformation> = await this.requestCollection(qs, StorageItemInformation.parse, null, 'GET');
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    /** @deprecated Renamed to getBucketItemsInformation. Kept for backwards compatibility. */
    public async getPoolItemsInformation(projectEnvironmentId: string, storageType: StorageType, bucketKey: string, pagination: CursorPagination | null = null): Promise<CollectionResult<StorageItemInformation>> {
        return this.getBucketItemsInformation(projectEnvironmentId, storageType, bucketKey, pagination);
    }

    /** @deprecated Renamed to clearBucket. Kept for backwards compatibility. */
    public async clearPool(projectEnvironmentId: string, storageType: StorageType, bucketKey: string): Promise<boolean> {
        return this.clearBucket(projectEnvironmentId, storageType, bucketKey);
    }

    public async getItem(projectEnvironmentId: string, storageType: StorageType, bucketKey: string, storageItemKey: string): Promise<StorageItem | null> {
        const cmd: string = path('/projectenvironments/:projectEnvironmentId/storage/:storageType/:bucketKey/items/:storageItemKey', {projectEnvironmentId, storageType, bucketKey, storageItemKey});

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

    public async getBucketItem(storageBucketId: string, storageItemKey: string): Promise<StorageItem | null> {
        const cmd: string = path('/storage-buckets/:storageBucketId/items/:storageItemKey', {storageBucketId, storageItemKey});

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

    /**
     * The item's bytes, without decoding. Use for anything binary — an image, an archive — where the
     * JSON envelope would either inflate it (base64) or destroy it (a UTF-8 decode replaces every
     * invalid sequence, so bytes do not survive the round trip).
     */
    public async getItemBytes(projectEnvironmentId: string, storageType: StorageType, bucketKey: string, storageItemKey: string): Promise<Buffer> {
        const cmd: string = path('/projectenvironments/:projectEnvironmentId/storage/:storageType/:bucketKey/items/:key', {projectEnvironmentId, storageType, bucketKey, key: storageItemKey});
        return await this.requestBytes(cmd);
    }

    /**
     * Store raw bytes. Metadata travels as headers, since the body is the value.
     *
     * Pass `contentType` for anything that will be served to a browser — the CDN reads it back as the
     * response `Content-Type`, and without it an image is delivered as `application/octet-stream`,
     * which downloads rather than renders.
     */
    public async setItemBytes(projectEnvironmentId: string, storageType: StorageType, bucketKey: string, storageItemKey: string, value: Buffer, expiration: Date | null = null, contentType: string | null = null): Promise<void> {
        const cmd: string = path('/projectenvironments/:projectEnvironmentId/storage/:storageType/:bucketKey/items/:key', {projectEnvironmentId, storageType, bucketKey, key: storageItemKey});
        const headers: Record<string, string> = {};
        if (expiration !== null) {
            headers['X-Attlaz-Expiration'] = expiration.toISOString();
        }
        if (contentType !== null) {
            headers['X-Attlaz-Content-Type'] = contentType;
        }
        await this.requestBinary(cmd, value, headers);
    }

    public async setItem(projectEnvironmentId: string, storageType: StorageType, bucketKey: string, storageItem: StorageItem): Promise<StorageItem> {
        const cmd: string = path('/projectenvironments/:projectEnvironmentId/storage/:storageType/:bucketKey/items/:key', {projectEnvironmentId, storageType, bucketKey, key: storageItem.key});

        try {
            const result: ObjectResult<StorageItem> = await this.requestObject(cmd, storageItem, StorageItem.parse, 'POST');

            const savedItem: StorageItem | null = result.getData();
            if (savedItem === null) {
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

    public async deleteItem(projectEnvironmentId: string, storageType: StorageType, bucketKey: string, storageItemKey: string): Promise<boolean> {
        const cmd: string = path('/projectenvironments/:projectEnvironmentId/storage/:storageType/:bucketKey/items/:storageItemKey', {projectEnvironmentId, storageType, bucketKey, storageItemKey});

        try {
            const parser = (raw: any): { deleted: boolean } => ({deleted: raw.deleted});
            const result: ObjectResult<{ deleted: boolean }> = await this.requestObject(cmd, null, parser, 'DELETE');
            const x: { deleted: boolean } | null = result.getData();
            if (x === null) {
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
