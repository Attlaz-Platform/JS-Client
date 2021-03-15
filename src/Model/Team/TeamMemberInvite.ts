import {TeamMemberRole} from './TeamMemberRole';
import {TeamMemberInviteState} from './TeamMemberInviteState';

export class TeamMemberInvite {
    public id: string;
    public code: string;
    public teamId: string;
    public email: string;
    public role: TeamMemberRole;
    public date: Date;
    public expiration: Date;
    public inviterId: string;
    public state: TeamMemberInviteState = TeamMemberInviteState.Accepted;
}
