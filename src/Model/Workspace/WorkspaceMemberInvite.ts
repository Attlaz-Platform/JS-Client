import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState.js';

export class WorkspaceMemberInvite {
    public id: string;
    public code: string;
    public workspaceId: string;
    public email: string;
    public role: string;
    public date: Date;
    public expiration: Date;
    public inviterId: string;
    public inviterEmail: string;
    public state: WorkspaceMemberInviteState = WorkspaceMemberInviteState.Accepted;
}
