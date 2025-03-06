import {Utils} from '../Utils.js';

import {UserAction} from '../Model/User/UserAction.js';
import {DataValueCollection} from '../Model/DataValueCollection.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class UserActionEndpoint extends Endpoint {
    public async getWorkspaceMemberActions(workspaceId: string, memberId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<UserAction>> {
        try {
            const queryString: QueryString = new QueryString('/workspaces/' + workspaceId + '/members/' + memberId + '/actions');
            queryString.addPagination(pagination);
            return await this.requestCollection<UserAction>(queryString, UserActionEndpoint.parse, null, 'GET');
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
            return await this.requestCollection<UserAction>(queryString, UserActionEndpoint.parse, null, 'GET');
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
            return await this.requestCollection<UserAction>(queryString, UserActionEndpoint.parse, null, 'GET');
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }
            throw error;
        }
    }

    public async getAll(pagination: CursorPagination | null = null): Promise<CollectionResult<UserAction>> {
        const queryString: QueryString = new QueryString('/audit-logs');
        queryString.addPagination(pagination);
        return await this.requestCollection<UserAction>(queryString, UserActionEndpoint.parse, null, 'GET');
    }

    private static parse(rawUserEvent: Record<string, unknown>): UserAction {
        const userAction: UserAction = new UserAction();

        userAction.id = rawUserEvent.id as string;
        userAction.userId = rawUserEvent.user as string;
        userAction.workspaceId = rawUserEvent.workspace as string;
        userAction.action = rawUserEvent.action as string;
        userAction.entityId = rawUserEvent.entity as string;
        userAction.entityType = rawUserEvent.entity_type as string;
        userAction.description = rawUserEvent.description as string;
        userAction.ip = rawUserEvent.ip as string;
        userAction.time = Utils.parseRawDate(rawUserEvent.time as Date);
        userAction.result = rawUserEvent.result as string;
        userAction.data = DataValueCollection.fromObject(rawUserEvent.data as any);

        return userAction;
    }
}
