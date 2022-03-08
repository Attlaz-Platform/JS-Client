import {TeamMemberRole} from './TeamMemberRole';
import {State} from '../State';
import {TeamMemberInviteState} from './TeamMemberInviteState';

export class TeamMember {
    id: string;
    email: string;
    invite: boolean;
    last_login: Date | null = null;
    name: string;
    role: TeamMemberRole;
    state: State | TeamMemberInviteState;
}
