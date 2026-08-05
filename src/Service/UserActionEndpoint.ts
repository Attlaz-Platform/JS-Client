import {path} from '../Http/Data/Path.js';
import {Utils} from '../Utils.js';

import {UserAction} from '../Model/User/UserAction.js';
import {UserActionFilter} from '../Model/User/UserActionFilter.js';
import {UserSummary, UserSummaryType} from '../Model/User/UserSummary.js';
import {State} from '../Model/State.js';
import {DataValueCollection} from '../Model/DataValueCollection.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class UserActionEndpoint extends Endpoint {
    public async getWorkspaceMemberActions(workspaceId: string, memberId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<UserAction>> {
        try {
            const queryString: QueryString = new QueryString(path('/workspaces/:workspaceId/members/:memberId/actions', {workspaceId, memberId}));
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
            const queryString: QueryString = new QueryString(path('/users/:userId/actions', {userId}));
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
            const queryString: QueryString = new QueryString(path('/resources/:resourceType/:resourceId/actions', {resourceType, resourceId}));
            queryString.addPagination(pagination);
            return await this.requestCollection<UserAction>(queryString, UserActionEndpoint.parse, null, 'GET');
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }
            throw error;
        }
    }

    public async getAll(pagination: CursorPagination | null = null, filter: UserActionFilter | null = null): Promise<CollectionResult<UserAction>> {
        const queryString: QueryString = new QueryString('/audit-logs');
        queryString.addPagination(pagination);
        if (filter !== null) {
            if (filter.userIds !== undefined && filter.userIds.length > 0) {
                queryString.set('user', filter.userIds);
            }
            if (filter.entityId !== undefined) {
                queryString.set('entity', filter.entityId);
            }
            if (filter.timeFrom !== undefined) {
                queryString.set('time_from', filter.timeFrom.toISOString());
            }
            if (filter.timeTo !== undefined) {
                queryString.set('time_to', filter.timeTo.toISOString());
            }
        }
        return await this.requestCollection<UserAction>(queryString, UserActionEndpoint.parse, null, 'GET');
    }

    /** Distinct users that appear in the audit log, resolved to display-safe summaries (for the user filter). */
    public async getDistinctUsers(): Promise<UserSummary[]> {
        const queryString: QueryString = new QueryString('/audit-logs/users');
        const result: CollectionResult<UserSummary> = await this.requestCollection<UserSummary>(queryString, UserActionEndpoint.parseSummary, null, 'GET');
        return result.getData();
    }

    private static parseSummary(raw: Record<string, unknown>): UserSummary {
        const summary: UserSummary = new UserSummary();
        summary.id = raw.id as string;
        summary.type = raw.type as UserSummaryType;
        summary.state = (raw.state === null || raw.state === undefined) ? null : State.fromString(raw.state as string);
        summary.displayName = raw.display_name as string;
        return summary;
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
