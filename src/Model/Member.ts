import {User} from './User';
import {State} from './State';

export class Member {
    public user: User;
    public role: number;
    public state: State = State.Active;

    public constructor(user: User, role: number) {
        this.user = user;
        this.role = role;
    }
}
