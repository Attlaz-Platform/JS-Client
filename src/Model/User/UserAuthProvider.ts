import {State} from '../State';
import {Utils} from '../../Utils';
import {StateAware} from '../StateAware';

export class UserAuthProvider implements StateAware {
    public id: number;
    public userId: string;
    public provider: string;
    public providerUserId: string;
    public providerUserEmail: string;
    public lastUsed: Date | null = null;
    public state: State = State.Active;

    public static parse(raw: any): UserAuthProvider {
        const userAuthProvider: UserAuthProvider = new UserAuthProvider();

        userAuthProvider.id = raw.id;
        userAuthProvider.userId = raw.user;
        userAuthProvider.provider = raw.provider;
        userAuthProvider.providerUserId = raw.provider_user;
        userAuthProvider.providerUserEmail = raw.provider_user_email;
        userAuthProvider.lastUsed = Utils.parseRawDate(raw.last_used);
        userAuthProvider.state = State.fromString(raw.state);

        return userAuthProvider;
    }
}
