import {WorkspaceMemberRole} from './WorkspaceMemberRole';
import {State} from '../State';
import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState';

export class WorkspaceMember {
    id: string;
    email: string;
    invite: boolean;
    last_login: Date | null = null;
    name: string;
    role: WorkspaceMemberRole;
    state: State | WorkspaceMemberInviteState;
}
