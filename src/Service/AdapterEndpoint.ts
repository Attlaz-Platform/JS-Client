import {Endpoint} from './Endpoint.js';
import {Adapter} from '../Model/Adapter/Adapter.js';
import {AdapterConnection} from '../Model/Adapter/AdapterConnection.js';
import {AdapterConfiguration} from '../Model/Adapter/AdapterConfiguration.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

export class AdapterEndpoint extends Endpoint {
    public async getAdapters(): Promise<CollectionResult<Adapter>> {
        try {
            const url: string = '/adapters';

            return await this.requestCollection(url, Adapter.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapters: ', error);
            }

            throw error;
        }
    }

    public async getAdapter(adapterId: string): Promise<Adapter | null> {
        try {
            const url: string = '/adapters/' + adapterId;

            const result: ObjectResult<Adapter> = await this.requestObject(url, null, Adapter.parse);
            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter by id: ', error);
            }

            throw error;
        }
    }

    public async getAdapterConfiguration(adapterId: string): Promise<CollectionResult<AdapterConfiguration>> {
        try {
            const url: string = '/adapters/' + adapterId + '/configuration';

            return await this.requestCollection(url, AdapterConfiguration.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }

            throw error;
        }
    }

    public async getConnections(projectId: string): Promise<CollectionResult<AdapterConnection>> {
        try {
            const url: string = '/projects/' + projectId + '/connections';

            return await this.requestCollection(url, AdapterConnection.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapters: ', error);
            }

            throw error;
        }
    }

    public async getConnectionByKey(connectionKey: string): Promise<AdapterConnection | null> {
        try {
            const url: string = '/connections/' + connectionKey;

            const result: ObjectResult<AdapterConnection> = await this.requestObject(url, null, AdapterConnection.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load connection: ', error);
            }

            throw error;
        }
    }

    public async saveConnection(projectId: string, adapter: AdapterConnection): Promise<AdapterConnection> {
        try {
            const url: string = '/projects/' + projectId + '/connections';
            const result: ObjectResult<AdapterConnection> = await this.requestObject(url, adapter, AdapterConnection.parse, 'POST');
            const updatedAdapterConnection: AdapterConnection | null = result.getData();
            if (updatedAdapterConnection === null) {
                throw new Error('AdapterConnection not updated');
            }
            return updatedAdapterConnection;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save connection: ', error);
            }
            throw error;
        }
    }
}
