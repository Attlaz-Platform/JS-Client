import {AdapterConnection} from '../Model/Adapter/AdapterConnection.js';
import {parseTestConnectionResult, TestConnectionResult} from '../Model/Adapter/TestConnectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {AdapterConnectionConfigurationValue} from '../Model/Adapter/AdapterConnectionConfigurationValue.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {AdapterConnectionEvent} from '../Model/Adapter/AdapterConnectionEvent.js';
import {Endpoint} from './Endpoint.js';

export class AdapterConnectionEndpoint extends Endpoint {


    public async getConnections(projectId: string, pagination: CursorPagination): Promise<CollectionResult<AdapterConnection>> {
        try {
            const queryString: QueryString = new QueryString('/projects/' + projectId + '/connections');
            queryString.addPagination(pagination);

            return await this.requestCollection(queryString, AdapterConnection.parse);
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

            return await this.requestCollection(url, parser);
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
            const res: { saved: boolean } | null = result.getData();
            if (res === null) {
                throw new Error('Unable to save connection configuration: wrong response from API');
            }
            return res.saved;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save connection: ', error);
            }
            throw error;
        }
    }

    public async getConnectionEvents(connectionId: string, pagination: CursorPagination): Promise<CollectionResult<AdapterConnectionEvent>> {
        const queryString: QueryString = new QueryString('/adapters/connections/' + connectionId + '/events');
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, AdapterConnectionEvent.parse);
    }

    /**
     * Test an adapter connection end-to-end via Services-Api.
     *
     * Runs schema validation first (config completeness) and then invokes the
     * adapter's `testConnection()` probe. The returned result has a per-check
     * breakdown so the UI can render a step-by-step view; the overall `state`
     * is the worst of the per-check states (skipped < passed < warning < failed).
     *
     * Used by the Web App's "Test" button. Replaces the legacy
     * `POST /connections/:id/check` route on Core-Api (removed).
     */
    public async testConnection(connectionId: string): Promise<TestConnectionResult> {
        const url: string = '/services/' + connectionId + '/test-connection';
        const result: ObjectResult<TestConnectionResult> = await this.requestObject(url, null, parseTestConnectionResult, 'POST');
        const data: TestConnectionResult | null = result.getData();
        if (data === null) {
            return {state: 'skipped', checks: [], error: 'Empty response from test endpoint'};
        }
        return data;
    }
}
