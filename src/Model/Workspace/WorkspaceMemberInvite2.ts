import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState';

export class WorkspaceMemberInvite2 {
    code: string;
    email: string | null;
    inviterName: string | null;
    inviterEmail: string | null;
    workspaceName: string | null;
    state: WorkspaceMemberInviteState;

    public static parse(rawInvite: any): WorkspaceMemberInvite2 {
        return {
            code: rawInvite.code,
            email: rawInvite.email,
            inviterName: rawInvite.inviter_name,
            inviterEmail: rawInvite.inviter_email,
            workspaceName: rawInvite.workspace_name,
            state: WorkspaceMemberInviteState.fromString(rawInvite.state)
        };
    }
}
