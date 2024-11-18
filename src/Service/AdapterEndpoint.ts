import {Adapter} from '../Model/Adapter/Adapter.js';
import {AdapterConfiguration} from '../Model/Adapter/AdapterConfiguration.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {AdapterCategory} from '../Model/Adapter/AdapterCategory.js';
import {Endpoint} from './Endpoint.js';

export class AdapterEndpoint extends Endpoint {
    public async getAdapters(pagination: CursorPagination | null = null, withMedia: boolean = false): Promise<CollectionResult<Adapter>> {
        try {
            const queryString: QueryString = new QueryString('/adapters');
            queryString.addPagination(pagination);
            if (withMedia) {
                queryString.set('with-media', true);
            }

            return await this.requestCollection(queryString, Adapter.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapters: ', error);
            }

            throw error;
        }
    }

    public async getAdapter(adapterId: string, withMedia: boolean = false): Promise<Adapter | null> {
        try {
            const queryString: QueryString = new QueryString('/adapters/' + adapterId);
            if (withMedia) {
                queryString.set('with-media', true);
            }

            const result: ObjectResult<Adapter> = await this.requestObject(queryString, null, Adapter.parse);
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

    public async getAdapterCategories(pagination: CursorPagination): Promise<CollectionResult<AdapterCategory>> {
        try {
            const queryString: QueryString = new QueryString('/adapter-categories');
            queryString.addPagination(pagination);

            return await this.requestCollection(queryString, AdapterCategory.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter categories: ', error);
            }

            throw error;
        }
    }
}
