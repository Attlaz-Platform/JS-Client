import {path as buildPath} from '../Http/Data/Path.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Configuration} from '../Model/Configuration/Configuration.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class ConfigurationEndpoint extends Endpoint {
    public async getByPath(scopeId: string, path: string): Promise<Configuration | null> {
        try {

            const qs: QueryString = new QueryString(buildPath('/configurations/:scopeId', {scopeId}));
            qs.set('path', path)

            const result: ObjectResult<Configuration> = await this.requestObject(qs, null, Configuration.parse);

            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load configuration', error);
            }
            throw error;
        }
    }

    public async getByPathQuery(scopeId: string, pathQuery: string, pagination: CursorPagination): Promise<CollectionResult<Configuration>> {
        try {

            const qs: QueryString = new QueryString(buildPath('/configurations/query/:scopeId', {scopeId}));
            qs.set('query', pathQuery);
            qs.addPagination(pagination);

            const result: CollectionResult<Configuration> = await this.requestCollection(qs, Configuration.parse);

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Unable to load configuration', error);
            }
            throw error;
        }
    }

    /** Write the value at this path and scope, returning the row as stored. */
    public async save(scopeId: string, path: string, value: unknown): Promise<Configuration | null> {

        const qs: QueryString = new QueryString(buildPath('/configurations/:scopeId', {scopeId}));
        qs.set('path', path);

        // The API answers with the single saved row, not a collection.
        const result: ObjectResult<Configuration> = await this.requestObject(qs, {value: value}, Configuration.parse, 'POST');

        return result.getData();
    }

    /**
     * Remove a configuration row so resolution falls back to the parent scope.
     * Use this for the "Clear field" / "Inherit from parent" UX action.
     *
     * Distinct from `save(scopeId, path, null)` which keeps an explicit "no value"
     * override at this scope (e.g. for limit fields meaning "no limit").
     */
    public async delete(scopeId: string, path: string): Promise<ObjectResult<{removed: boolean}>> {
        const qs: QueryString = new QueryString(buildPath('/configurations/:scopeId', {scopeId}));
        qs.set('path', path);

        const result: ObjectResult<{removed: boolean}> = await this.requestObject(qs, null, (raw: unknown) => raw as {removed: boolean}, 'DELETE');
        return result;
    }
}
