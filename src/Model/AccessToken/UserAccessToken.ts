import {StateAware} from '../StateAware.js';
import {State} from '../State.js';
import {Utils} from '../../Utils.js';

export class UserAccessToken implements StateAware {
    public id: string;
    public userId: string;

    public ipAllowList: string[] = [];
    public name: string;
    public scopes: string[] = [];

    public secretRedacted: string | null = null;

    public createdAt: Date;
    public lastUsedAt: Date | null = null;
    public expiresAt: Date | null = null;

    public state: State = State.Active;

    public static parse(rawUser: any): UserAccessToken {
        const userAccessToken: UserAccessToken = new UserAccessToken();
        userAccessToken.id = rawUser.id;
        // userAccessToken.accessTokenId = rawUser.access_token;
        userAccessToken.userId = rawUser.user;
        userAccessToken.ipAllowList = rawUser.ip_allow_list;
        userAccessToken.name = rawUser.name;
        userAccessToken.scopes = rawUser.scopes;
        userAccessToken.secretRedacted = rawUser.secret_redacted;
        userAccessToken.createdAt = Utils.parseRawDate(rawUser.created_at);
        userAccessToken.lastUsedAt = rawUser.last_used_at === null ? null : Utils.parseRawDate(rawUser.last_used_at);
        userAccessToken.expiresAt = rawUser.expires_at === null ? null : Utils.parseRawDate(rawUser.expires_at);
        userAccessToken.state = State.fromString(rawUser.state);

        return userAccessToken;
    }
}
