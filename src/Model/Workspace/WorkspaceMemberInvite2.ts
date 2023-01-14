import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState';

export class WorkspaceMemberInvite2 {
    code: string;
    email: string | null;
    inviter_name: string | null;
    inviter_email: string | null;
    team_name: string | null;
    state: WorkspaceMemberInviteState;

    public static parse(rawInvite: any): WorkspaceMemberInvite2 {
        return {
            code: rawInvite.code,
            email: rawInvite.email,
            inviter_name: rawInvite.inviter_name,
            inviter_email: rawInvite.inviter_email,
            team_name: rawInvite.team_name,
            state: WorkspaceMemberInviteState.fromString(rawInvite.state)
        };
    }
}
