import {WorkspaceMemberRole} from './WorkspaceMemberRole.js';
import {State} from '../State.js';
import {WorkspaceMemberInviteState} from './WorkspaceMemberInviteState.js';

export class WorkspaceMember {
    id: string;
    email: string;
    invite: boolean;
    last_login: Date | null = null;
    name: string;
    role: WorkspaceMemberRole;
    state: State | WorkspaceMemberInviteState;
}
