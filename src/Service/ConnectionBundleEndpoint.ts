import {path} from '../Http/Data/Path.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {ConnectionBundle} from '../Model/Connection/ConnectionBundle.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class ConnectionBundleEndpoint extends Endpoint {

    public async getBundles(projectId: string, pagination: CursorPagination): Promise<CollectionResult<ConnectionBundle>> {
        try {
            const queryString: QueryString = new QueryString(path('/projects/:projectId/connection-bundles', {projectId}));
            queryString.addPagination(pagination);

            return await this.requestCollection(queryString, ConnectionBundle.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load connection bundles: ', error);
            }
            throw error;
        }
    }

    public async getBundleById(bundleId: string): Promise<ConnectionBundle | null> {
        try {
            const url: string = path('/connection-bundles/:bundleId', {bundleId});

            const result: ObjectResult<ConnectionBundle> = await this.requestObject(url, null, ConnectionBundle.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load connection bundle: ', error);
            }
            throw error;
        }
    }

    public async createBundle(projectId: string, name: string, connectionIds: string[] = []): Promise<ConnectionBundle> {
        try {
            const url: string = path('/projects/:projectId/connection-bundles', {projectId});

            const result: ObjectResult<ConnectionBundle> = await this.requestObject(
                url, {name, connections: connectionIds}, ConnectionBundle.parse, 'POST',
            );

            const created: ConnectionBundle | null = result.getData();
            if (created === null) {
                throw new Error('Connection bundle not created');
            }
            return created;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create connection bundle: ', error);
            }
            throw error;
        }
    }

    public async renameBundle(bundleId: string, name: string): Promise<ConnectionBundle> {
        try {
            const url: string = path('/connection-bundles/:bundleId', {bundleId});

            const result: ObjectResult<ConnectionBundle> = await this.requestObject(url, {name}, ConnectionBundle.parse, 'PATCH');

            const updated: ConnectionBundle | null = result.getData();
            if (updated === null) {
                throw new Error('Connection bundle not updated');
            }
            return updated;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to rename connection bundle: ', error);
            }
            throw error;
        }
    }

    /**
     * Add and remove address one membership at a time rather than sending the whole list, so two
     * people editing the same bundle cannot silently drop each other's change.
     */
    public async addConnection(bundleId: string, connectionId: string): Promise<ConnectionBundle> {
        return await this.changeMembership(bundleId, connectionId, 'PUT', 'add the connection to');
    }

    public async removeConnection(bundleId: string, connectionId: string): Promise<ConnectionBundle> {
        return await this.changeMembership(bundleId, connectionId, 'DELETE', 'remove the connection from');
    }

    private async changeMembership(bundleId: string, connectionId: string, method: string, description: string): Promise<ConnectionBundle> {
        try {
            const url: string = path('/connection-bundles/:bundleId/connections/:connectionId', {bundleId, connectionId});

            const result: ObjectResult<ConnectionBundle> = await this.requestObject(url, null, ConnectionBundle.parse, method);

            const updated: ConnectionBundle | null = result.getData();
            if (updated === null) {
                throw new Error('Connection bundle not updated');
            }
            return updated;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to ' + description + ' the bundle: ', error);
            }
            throw error;
        }
    }
}
