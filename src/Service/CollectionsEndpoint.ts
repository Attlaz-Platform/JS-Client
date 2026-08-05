import {path} from '../Http/Data/Path.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Collection} from '../Model/Collections/Collection.js';
import {Endpoint} from './Endpoint.js';
import {CollectionRecord} from '../Model/Collections/CollectionRecord.js';

export class CollectionsEndpoint extends Endpoint {
    public async getAll(projectId: string, pagination: CursorPagination): Promise<CollectionResult<Collection>> {
        const qs: QueryString = new QueryString(path('/projects/:projectId/collections', {projectId}));
        qs.addPagination(pagination);
        return await this.requestCollection<Collection>(qs, Collection.parse);

    }

    public async getById(collectionId: string): Promise<Collection | null> {
        try {
            const qs: QueryString = new QueryString(path('/collections/:collectionId', {collectionId}));


            const result: ObjectResult<Collection> = await this.requestObject<Collection>(qs, null, Collection.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load Collection by id: ', error);
            }

            throw error;
        }
    }

    public async getRecords(collectionId: string, pagination: CursorPagination): Promise<CollectionResult<CollectionRecord>> {
        try {
            const qs: QueryString = new QueryString(path('/collections/:collectionId/records', {collectionId}));
            qs.addPagination(pagination);

            return await this.requestCollection<CollectionRecord>(qs, CollectionRecord.parse);
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load Collection by id: ', error);
            }

            throw error;
        }
    }

    public async addRecord(collectionId: string, properties: unknown): Promise<CollectionRecord> {
        try {
            const qs: QueryString = new QueryString(path('/collections/:collectionId', {collectionId}));

            const result: ObjectResult<CollectionRecord> = await this.requestObject(qs, {properties}, CollectionRecord.parse, 'POST');
            const updatedWorkspace: CollectionRecord | null = result.getData();
            if (updatedWorkspace === null) {
                throw new Error('CollectionRecord not created');
            }
            return updatedWorkspace;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save CollectionRecord: ', error);
            }
            throw error;
        }
    }
}
