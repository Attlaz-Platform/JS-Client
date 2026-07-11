import {State} from '../State.js';
import {Utils} from '../../Utils.js';
import {StateAware} from '../StateAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class UserAuthProvider implements StateAware {
    public id: string;
    public userId: string;
    public provider: string;
    public providerUserId: string;
    public providerUserEmail: string;
    public lastUsed: Date | null = null;
    public state: State = State.Active;

    public static parse(raw: ApiRecord): UserAuthProvider {
        const userAuthProvider: UserAuthProvider = new UserAuthProvider();
        userAuthProvider.id = raw.id as string;
        userAuthProvider.userId = raw.user as string;
        userAuthProvider.provider = raw.provider as string;
        userAuthProvider.providerUserId = raw.provider_user as string;
        userAuthProvider.providerUserEmail = raw.provider_user_email as string;
        userAuthProvider.lastUsed = Utils.parseRawDate(raw.last_used as Date);
        userAuthProvider.state = State.fromString(raw.state as string);

        return userAuthProvider;
    }
}
