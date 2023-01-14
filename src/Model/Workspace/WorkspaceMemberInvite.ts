import {WorkspaceMemberRole} from './WorkspaceMemberRole';
import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState';

export class WorkspaceMemberInvite {
    public id: string;
    public code: string;
    public teamId: string;
    public email: string;
    public role: WorkspaceMemberRole;
    public date: Date;
    public expiration: Date;
    public inviterId: string;
    public inviterEmail: string;
    public state: WorkspaceMemberInviteState = WorkspaceMemberInviteState.Accepted;
}
