import {TeamMemberInviteState} from 'attlaz-client';

export class TeamMemberInvite {
    code: string;
    state: TeamMemberInviteState;
    email: string | null;
    inviter_name: string | null;
    inviter_email: string | null;
    team_name: string | null;
}
