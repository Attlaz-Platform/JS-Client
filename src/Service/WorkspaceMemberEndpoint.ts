import {Endpoint} from './Endpoint.js';

import {Utils} from '../Utils.js';
import {State} from '../Model/State.js';
import {WorkspaceMember} from '../Model/Workspace/WorkspaceMember.js';
import {WorkspaceMemberInviteState} from '../Model/Workspace/WorkspaceMemberInviteState.js';
import {WorkspaceMemberInvite} from '../Model/Workspace/WorkspaceMemberInvite.js';
import {WorkspaceMemberInvite2} from '../Model/Workspace/WorkspaceMemberInvite2.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {WorkspaceMemberRole} from '../Model/Workspace/WorkspaceMemberRole.js';

export class WorkspaceMemberEndpoint extends Endpoint {
    public async getByWorkspace(workspaceId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<WorkspaceMember>> {
        const queryString: QueryString = new QueryString('workspaces/' + workspaceId + '/members');
        queryString.addPagination(pagination);


        const parser = (rawMember: any): WorkspaceMember => {
            const member: WorkspaceMember = new WorkspaceMember();
            member.id = rawMember.id;
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
        };
        const result: CollectionResult<WorkspaceMember> = await this.requestCollection(queryString, parser);

        return result;
    }

    public async invite(workspaceId: string, invites: WorkspaceMemberInvite[]): Promise<boolean> {
        const cmd: string = '/workspaces/' + workspaceId + '/invites';

        const rawInvites: { email: string, role: string }[] = [];
        for (const invite of invites) {
            rawInvites.push({email: invite.email, role: invite.role.toString()});
        }

        try {
            const parser = (raw: any): any => raw;
            const result: ObjectResult<void> = await this.requestObject(cmd, {invites: rawInvites}, parser, 'POST');

            const re: any | null = result.getData();
            if (re === null) {
                console.log('invite member wrong data', {result, parsed: re});
                throw new Error('Unable invite member: wrong response from API');
            }
            // if (Utils.isNullOrUndefined(result)) {
            //     return null;
            // }
            console.log('Invite', re);
            return true;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to invite members to workspace "' + workspaceId + '": ', ex);
            }

            throw ex;
        }
    }

    public async getWorkspaceInviteByCode(inviteCode: string): Promise<WorkspaceMemberInvite2 | null> {
        const cmd: string = '/workspaces/invites/' + inviteCode;

        const rawInvite: ObjectResult<WorkspaceMemberInvite2> = await this.requestObject(cmd, null, WorkspaceMemberInvite2.parse, 'GET', false);
        if (rawInvite !== null) {
            return rawInvite.getData();
        }

        return null;
    }

    public async getRoles(workspaceId: string): Promise<CollectionResult<WorkspaceMemberRole>> {
        const cmd: string = '/workspaces/' + workspaceId + '/member-roles';

        const parser = (raw: any): WorkspaceMemberRole => {
            const role: WorkspaceMemberRole = new WorkspaceMemberRole();
            role.id = raw.id;
            role.name = raw.name;
            return role;
        };
        return await this.requestCollection<WorkspaceMemberRole>(cmd, parser);
    }
}
