import {User} from '../User';
import {State} from '../State';
import {TeamMemberInviteState} from './TeamMemberInviteState';

export class Member {
    public user: User;
    public role: number;
    public state: State = State.Active;

    public inviteCode: string;
    public inviteDate: Date;
    public inviteState: TeamMemberInviteState;
    public inviteUser: string;

    public constructor(user: User, role: number) {
        this.user = user;
        this.role = role;
    }
}
