import {UserAuthProvider} from '../Model/User/UserAuthProvider.js';
import {User} from '../Model/User/User.js';
import {UserSummary, UserSummaryType} from '../Model/User/UserSummary.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Endpoint} from './Endpoint.js';
import {UserNotificationSession} from '../Model/User/UserNotificationSession.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {State} from '../Model/State.js';

export class UserEndpoint extends Endpoint {
    public async getUser(): Promise<User | null> {
        const cmd: string = '/users';

        const rawUser: ObjectResult<User> = await this.requestObject(cmd, null, User.parse);
        return rawUser.getData();
    }

    public async removeAuthProvider(providerId: string): Promise<boolean> {
        try {
            const parser = (raw: any): { deleted: boolean } => ({deleted: raw.deleted});
            const result: ObjectResult<{
                deleted: boolean
            }> = await this.requestObject('/users/auth/providers', {provider: providerId}, parser, 'DELETE');
            const re: { deleted: boolean } | null = result.getData();
            if (re === null) {
                throw new Error('Unable to remove auth provider: wrong response from API');
            }
            return re.deleted;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to assign auth provider: ', e);
            }
            throw e;
        }
    }

    /**
     * Resolve display-safe summaries for a set of user ids (e.g. to show "Requested by" names in a
     * list). The server applies visibility rules and returns tombstones ("Unknown user" / "Removed
     * user") rather than leaking anything the caller isn't allowed to see.
     */
    public async getSummaries(userIds: string[]): Promise<UserSummary[]> {
        if (userIds.length === 0) {
            return [];
        }
        const queryString: QueryString = new QueryString('/users/summaries');
        queryString.set('id', userIds);
        const result: CollectionResult<UserSummary> = await this.requestCollection<UserSummary>(queryString, UserEndpoint.parseSummary, null, 'GET');
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

    public async getAuthProviders(): Promise<CollectionResult<UserAuthProvider>> {
        const cmd: string = '/users/auth/providers';

        const rawAuthProviders: CollectionResult<UserAuthProvider> = await this.requestCollection<UserAuthProvider>(cmd, UserAuthProvider.parse);

        return rawAuthProviders;
    }

    public async getPermissions(): Promise<CollectionResult<{ key: string; allowed: boolean }>> {
        const cmd: string = '/permissions';

        const parser = (raw: any): { key: string; allowed: boolean } => ({key: raw.key, allowed: raw.allowed});
        const data: CollectionResult<{ key: string; allowed: boolean }> = await this.requestCollection<{
            key: string; allowed: boolean
        }>(cmd, parser);

        return data;
    }

    public async update(user: User): Promise<User> {
        try {
            const url: string = '/users/' + user.id;
            const result: ObjectResult<User> = await this.requestObject(url, user, User.parse, 'POST');
            const updatedUser: User | null = result.getData();
            if (updatedUser === null) {
                throw new Error('User not updated');
            }
            return updatedUser;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }

    public async create(user: User, password: string, invitationCode: string | null = null): Promise<User> {
        try {
            const url: string = '/users/';
            const data = {...user, password, invitation_code: invitationCode};

            const result: ObjectResult<User> = await this.requestObject(url, data, User.parse, 'PUT', false);

            const createdUser: User | null = result.getData();
            if (createdUser === null) {
                throw new Error('User not created');
            }
            return createdUser;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create user: ', e);
            }
            throw e;
        }
    }

    public async requestResetPassword(email: string): Promise<boolean> {
        try {
            const url: string = '/users/resetpassword';

            const parser = (raw: any): { requested: boolean } => ({requested: raw.requested});
            const result: ObjectResult<{
                requested: boolean
            }> = await this.requestObject(url, {email}, parser, 'POST', false);
            const re: { requested: boolean } | null = result.getData();
            if (re === null) {
                throw new Error('Unable to request password reset: wrong response from API');
            }
            return re.requested;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }

    public async resetPassword(code: string, password: string): Promise<boolean> {
        try {
            const url: string = '/users/resetpassword/' + code;
            const parser = (raw: any): { updated: boolean } => ({updated: raw.updated});
            const result: ObjectResult<{
                updated: boolean
            }> = await this.requestObject(url, {password}, parser, 'POST', false);
            const re: { updated: boolean } | null = result.getData();
            if (re === null) {
                throw new Error('Unable to reset password: wrong response from API');
            }
            return re.updated;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }

    public async createWebPush(session: UserNotificationSession): Promise<boolean> {
        try {
            const url: string = '/webpush';

            const data = {
                session: session.session,
                subscription: session.subscription,
                expires_at: session.expiresAt,
                os: session.os,
                browser: session.browser,
            };

            const parser = (raw: any): { created: boolean } => ({created: raw.created});
            const result: ObjectResult<{
                created: boolean
            }> = await this.requestObject(url, data, parser, 'POST', true);
            const re: { created: boolean } | null = result.getData();
            if (re === null) {
                throw new Error('Unable to request web push: wrong response from API');
            }
            return re.created;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create web push: ', e);
            }
            throw e;
        }
    }

    public async getSessions(pagination: CursorPagination): Promise<CollectionResult<UserNotificationSession>> {


        const queryString: QueryString = new QueryString('/webpush');
        queryString.addPagination(pagination);

        const parser = (raw: Record<string, unknown>): UserNotificationSession => {

            const session: UserNotificationSession = new UserNotificationSession();
            session.id = raw.id as string;
            session.session = raw.session as string;
            session.state = State.fromString(raw.state as string);
            session.createdAt = raw.created_at as Date;
            session.updatedAt = raw.updated_at as Date;
            session.expiresAt = raw.expires_at as Date;
            session.os = raw.os as string;
            session.browser = raw.browser as string;
            return session;

        }
        const rawTriggers = await this.requestCollection(queryString, parser);
        return rawTriggers;

    }
}
