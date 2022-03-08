import {Endpoint} from './Endpoint';
import {DataResult} from '../Model/Result/DataResult';
import {StorageType} from '../Model/Storage/StorageType';
import {Utils} from '../Utils';
import {StorageInformation} from '../Model/Storage/StorageInformation';

export class StorageEndpoint extends Endpoint {

    public async getInformation(projectEnvironmentId: string, storageType: StorageType): Promise<DataResult<StorageInformation>> {

        let cmd: string = '/projectenvironments/' + projectEnvironmentId + '/storage/' + storageType;

        try {
            const result: DataResult<StorageInformation> = await this.request(cmd, null, 'GET');

            // if (Utils.isNullOrUndefined(result)) {
            //     return null;
            // }

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

            // if (Utils.isNullOrUndefined(result)) {
            //     return null;
            // }

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get storage information', ex);
            }

            throw ex;
        }
    }

    // public async getItemKeys(projectEnvironmentId: string, storageType: StorageType, poolKey: string): Promise<string[]> {
    //     return ['item1', 'item2', 'item3']
    // }
}

