import {Endpoint} from './Endpoint';
import {Adapter} from '../Model/Adapter/Adapter';
import {DataResult} from '../Model/Result/DataResult';
import {AdapterConnection} from '../Model/Adapter/AdapterConnection';
import {AdapterConfiguration} from '../Model/Adapter/AdapterConfiguration';

export class AdapterEndpoint extends Endpoint {

    public async getAdapters(): Promise<DataResult<Adapter[]>> {
        try {

            let url: string = '/adapters';

            const result: DataResult<Adapter[]> = await this.request(url, null, 'GET');

            result.setData(this.parseCollection(result, Adapter.parse));

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapters: ', error);
            }

            throw error;
        }

    }

    public async getAdapter(adapterId: string): Promise<DataResult<Adapter>> {
        try {

            let url: string = '/adapters/' + adapterId;

            const result: DataResult<Adapter> = await this.request(url, null, 'GET');

            result.setData(Adapter.parse(result.getData()));

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter by id: ', error);
            }

            throw error;
        }

    }

    public async getAdapterConfiguration(adapterId: string): Promise<DataResult<AdapterConfiguration[]>> {
        try {

            let url: string = '/adapters/' + adapterId + '/configuration';

            const result: DataResult<AdapterConfiguration[]> = await this.request(url, null, 'GET');

            result.setData(this.parseCollection(result, AdapterConfiguration.parse));

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }

            throw error;
        }

    }

    public async getConnections(projectId: string): Promise<DataResult<AdapterConnection[]>> {
        try {

            let url: string = '/project/' + projectId + '/connections';

            const result: DataResult<AdapterConnection[]> = await this.request(url, null, 'GET');

            result.setData(this.parseCollection(result, AdapterConnection.parse));

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapters: ', error);
            }

            throw error;
        }

    }

    public async getConnectionByKey(connectionKey: string): Promise<DataResult<AdapterConnection>> {
        try {

            let url: string = '/connections/' + connectionKey;

            const result: DataResult<AdapterConnection> = await this.request(url, null, 'GET');

            result.setData(AdapterConnection.parse(result.getData()));

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load connection: ', error);
            }

            throw error;
        }

    }

    public async saveConnection(projectId: string, adapter: AdapterConnection): Promise<DataResult<AdapterConnection>> {
        try {

            let url: string = '/project/' + projectId + '/connections';

            const result: DataResult<AdapterConnection> = await this.request(url, adapter, 'POST');

            result.setData(AdapterConnection.parse(result.getData()));

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save connection: ', error);
            }

            throw error;
        }
    }
}
