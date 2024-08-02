import {State} from '../State.js';
import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState.js';
import {Utils} from '../../Utils.js';

export class WorkspaceMember {
    public id: string;
    public workspaceId: string;
    public email: string;
    public invite: boolean;
    public last_login: Date | null = null;
    public name: string;
    public role: string;
    public state: State | WorkspaceMemberInviteState;

    public static parse(rawMember: any): WorkspaceMember {
        const member: WorkspaceMember = new WorkspaceMember();
        member.id = rawMember.id;
        member.workspaceId = rawMember.workspace;

        member.email = rawMember.email;
        member.invite = Utils.isTrue(rawMember.invite);
        if (rawMember.last_login !== null && rawMember.last_login !== undefined) {
            member.last_login = Utils.parseRawDate(rawMember.last_login);
        }
        member.name = rawMember.name;
        member.role = rawMember.role;


        if (member.invite) {
            member.state = WorkspaceMemberInviteState.fromString(rawMember.state);
        } else {
            member.state = State.fromString(rawMember.state);
        }
        return member;
    }
}
