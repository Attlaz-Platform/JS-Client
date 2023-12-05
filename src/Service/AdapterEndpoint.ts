import {Endpoint} from './Endpoint.js';
import {Adapter} from '../Model/Adapter/Adapter.js';
import {AdapterConnection} from '../Model/Adapter/AdapterConnection.js';
import {AdapterConfiguration} from '../Model/Adapter/AdapterConfiguration.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {AdapterConnectionConfigurationValue} from '../Model/Adapter/AdapterConnectionConfigurationValue.js';

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

    public async getConnectionById(connectionId: string): Promise<AdapterConnection | null> {
        try {
            const url: string = '/connections/' + connectionId;

            const result: ObjectResult<AdapterConnection> = await this.requestObject(url, null, AdapterConnection.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load connection: ', error);
            }

            throw error;
        }
    }

    public async getConnectionByKey(projectId: string, connectionKey: string): Promise<AdapterConnection | null> {
        try {
            const url: string = '/projects/' + projectId + '/connections/' + connectionKey;

            const result: ObjectResult<AdapterConnection> = await this.requestObject(url, null, AdapterConnection.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load connection: ', error);
            }

            throw error;
        }
    }

    public async getConnectionConfiguration(connectionId: string): Promise<CollectionResult<AdapterConnectionConfigurationValue>> {
        try {
            const url: string = '/connections/' + connectionId + '/configuration';

            const parser = (raw: any): AdapterConnectionConfigurationValue => ({
                id: raw.id,
                adapterConnectionId: raw.adapter_connection,
                configurationId: raw.configuration,
                value: raw.value,
            });

            return this.requestCollection(url, parser);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load connection: ', error);
            }

            throw error;
        }
    }

    public async saveConnection(projectId: string, connection: AdapterConnection): Promise<AdapterConnection> {
        try {
            const url: string = '/projects/' + projectId + '/connections';
            const result: ObjectResult<AdapterConnection> = await this.requestObject(url, connection, AdapterConnection.parse, 'POST');
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

    public async saveConnectionConfiguration(connectionId: string, configuration: AdapterConnectionConfigurationValue[]): Promise<boolean> {
        try {
            const url: string = '/connections/' + connectionId + '/configuration';

            const parser = (raw: any): { saved: boolean } => ({saved: raw.saved});
            const result: ObjectResult<{
                saved: boolean
            }> = await this.requestObject(url, {configuration: configuration}, parser, 'POST');
            const x: { saved: boolean } | null = result.getData();
            if (x === null) {
                throw new Error('Unable to save connection configuration: wrong response from API');
            }
            return x.saved;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save connection: ', error);
            }
            throw error;
        }
    }
}
