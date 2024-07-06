import {Endpoint} from './Endpoint.js';

import {Utils} from '../Utils.js';

import {UserAction} from '../Model/User/UserAction.js';
import {DataValueCollection} from '../Model/DataValueCollection.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';

export class UserActionEndpoint extends Endpoint {
    public async getWorkspaceMemberActions(workspaceId: string, memberId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<UserAction>> {
        try {
            const queryString: QueryString = new QueryString('/workspaces/' + workspaceId + '/members/' + memberId + '/actions');
            queryString.addPagination(pagination);
            const result: CollectionResult<UserAction> = await this.requestCollection(queryString, UserActionEndpoint.parse, null, 'GET');

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }
            throw error;
        }
    }

    public async getUserActions(userId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<UserAction>> {
        try {
            const queryString: QueryString = new QueryString('/users/' + userId + '/actions');
            queryString.addPagination(pagination);
            const result: CollectionResult<UserAction> = await this.requestCollection(queryString, UserActionEndpoint.parse, null, 'GET');

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }
            throw error;
        }
    }

    public async getByResource(resourceId: string, resourceType: string, pagination: CursorPagination | null = null): Promise<CollectionResult<UserAction>> {
        try {
            const queryString: QueryString = new QueryString('/resources/' + resourceType + '/' + resourceId + '/actions');
            queryString.addPagination(pagination);
            const result: CollectionResult<UserAction> = await this.requestCollection(queryString, UserActionEndpoint.parse, null, 'GET');

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }
            throw error;
        }
    }

    private static parse(rawUserEvent: any): UserAction {
        const userAction: UserAction = new UserAction();

        userAction.id = rawUserEvent.id;
        userAction.userId = rawUserEvent.user;
        userAction.workspaceId = rawUserEvent.workspace;
        userAction.action = rawUserEvent.action;
        userAction.resourceId = rawUserEvent.resource;
        userAction.resourceType = rawUserEvent.resource_type;
        userAction.description = rawUserEvent.description;
        userAction.ip = rawUserEvent.ip;
        userAction.time = Utils.parseRawDate(rawUserEvent.time);
        userAction.result = rawUserEvent.result;
        userAction.data = DataValueCollection.fromObject(rawUserEvent.data);

        return userAction;
    }
}
