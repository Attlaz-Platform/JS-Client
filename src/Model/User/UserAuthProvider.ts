import {State} from '../State';
import {Utils} from '../../Utils';

export class UserAuthProvider {
    public id: number;
    public userId: string;
    public provider: string;
    public providerUserId: string;
    public lastUsed: Date;
    public state: State = State.Active;

    public static parse(rawUser: any): UserAuthProvider {
        const user: UserAuthProvider = new UserAuthProvider();

        user.id = rawUser.id;
        user.userId = rawUser.user;
        user.provider = rawUser.provider;
        user.providerUserId = rawUser.provider_user_id;
        user.lastUsed = Utils.parseDate(rawUser.last_used);
        user.state = State.fromString(rawUser.state);

        return user;
    }
}
