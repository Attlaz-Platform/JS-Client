import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class UserAccessToken implements StateAware {
    public id: string;
    public userId: string;

    public ipAllowList: string[] = [];
    public name: string;
    public scopes: string[] = [];

    public token: string;

    public createdAt: Date;
    public lastUsedAt: Date | null = null;
    public expiresAt: Date | null = null;

    public state: State = State.Active;

    public static parse(rawUser: ApiRecord): UserAccessToken {
        const userAccessToken: UserAccessToken = new UserAccessToken();
        userAccessToken.id = rawUser.id as string;
        userAccessToken.userId = rawUser.user as string;
        userAccessToken.ipAllowList = rawUser.ip_allow_list as string[];
        userAccessToken.name = rawUser.name as string;
        userAccessToken.scopes = rawUser.scopes as string[];
        userAccessToken.token = rawUser.token as string;
        userAccessToken.createdAt = Utils.parseRawDate(rawUser.created_at as Date);
        userAccessToken.lastUsedAt = rawUser.last_used_at === null ? null : Utils.parseRawDate(rawUser.last_used_at as Date);
        userAccessToken.expiresAt = rawUser.expires_at === null ? null : Utils.parseRawDate(rawUser.expires_at as Date);
        userAccessToken.state = State.fromString(rawUser.state as string);

        return userAccessToken;
    }
}
