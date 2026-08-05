import {path} from '../Http/Data/Path.js';
import {Trigger} from '../Model/Trigger/Trigger.js';
import {Utils} from '../Utils.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Parameters} from '../Http/Data/Parameters.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class TriggerEndpoint extends Endpoint {
    public async getByFlow(flowId: string, projectEnvironmentId: string | null = null, pagination: CursorPagination | null = null): Promise<CollectionResult<Trigger>> {
        try {
            const queryString: QueryString = new QueryString(path('/triggers/rfr/:flowId', {flowId}));
            queryString.addPagination(pagination);

            let parameters: Parameters = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            const rawTriggers: CollectionResult<Trigger> = await this.requestCollection(queryString, Trigger.parse, parameters);

            return rawTriggers;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load triggers: ', error);
            }
            throw error;
        }
    }

    public async getByCodeSource(codeSourceId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<Trigger>> {
        try {
            const queryString: QueryString = new QueryString(path('/triggers/csd/:codeSourceId', {codeSourceId}));
            queryString.addPagination(pagination);

            const rawTriggers: CollectionResult<Trigger> = await this.requestCollection(queryString, Trigger.parse, null);

            return rawTriggers;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load triggers: ', error);
            }
            throw error;
        }
    }

    public async getById(id: string): Promise<Trigger | null> {
        try {
            const result: ObjectResult<Trigger> = await this.requestObject(path('/triggers/:id', {id}), null, Trigger.parse);
            return result.getData();
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load trigger by id: ', error);
            }

            throw error;
        }
    }

    public async save(trigger: Trigger): Promise<Trigger> {
        try {
            const url: string = path('/flows/:flowId/triggers', {flowId: trigger.flowId});

            const result: ObjectResult<Trigger> = await this.requestObject(url, trigger, Trigger.parse, 'POST');

            const createdTrigger: Trigger | null = result.getData();
            if (createdTrigger === null) {
                throw new Error('Unable save trigger: wrong response from API');
            }
            return createdTrigger;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save trigger: ', error);
            }

            throw error;
        }
    }
}
