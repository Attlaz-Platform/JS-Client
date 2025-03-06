import {State} from '../State.js';
import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState.js';
import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class WorkspaceMember {
    public id: string;
    public workspaceId: string;
    public email: string;
    public invite: boolean;
    public lastLoginAt: Date | null = null;
    public name: string;
    public roleId: string;
    public state: State | WorkspaceMemberInviteState;

    public static parse(rawMember: ApiRecord): WorkspaceMember {
        const member: WorkspaceMember = new WorkspaceMember();
        member.id = rawMember.id as string;
        member.workspaceId = rawMember.workspace as string;

        member.email = rawMember.email as string;
        member.invite = Utils.isTrue(rawMember.invite as boolean);
        if (rawMember.last_login !== null && rawMember.last_login !== undefined) {
            member.lastLoginAt = Utils.parseRawDate(rawMember.last_login as Date);
        }
        member.name = rawMember.name as string;
        member.roleId = rawMember.role as string;


        if (member.invite) {
            member.state = WorkspaceMemberInviteState.fromString(rawMember.state as string);
        } else {
            member.state = State.fromString(rawMember.state as string);
        }
        return member;
    }
}
