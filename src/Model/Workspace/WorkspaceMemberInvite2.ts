import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState.js';
import {ApiRecord} from '../ApiRecord.js';

export class WorkspaceMemberInvite2 {
    code: string;
    email: string | null;
    inviterName: string | null;
    inviterEmail: string | null;
    workspaceName: string | null;
    state: WorkspaceMemberInviteState;

    public static parse(rawInvite: ApiRecord): WorkspaceMemberInvite2 {
        return {
            code: rawInvite.code as string,
            email: rawInvite.email as string | null,
            inviterName: rawInvite.inviter_name as string | null,
            inviterEmail: rawInvite.inviter_email as string | null,
            workspaceName: rawInvite.workspace_name as string | null,
            state: WorkspaceMemberInviteState.fromString(rawInvite.state as string),
        };
    }
}
