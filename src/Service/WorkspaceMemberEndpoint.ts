import {Endpoint} from './Endpoint';

import {Utils} from '../Utils';
import {State} from '../Model/State';

import {UserAction} from '../Model/User/UserAction';
import {DataValueCollection} from '../Model/DataValueCollection';
import {WorkspaceMember} from '../Model/Workspace/WorkspaceMember';
import {WorkspaceMemberRole} from '../Model/Workspace/WorkspaceMemberRole';
import {WorkspaceMemberInviteState} from '../Model/Workspace/WorkspaceMemberInviteState';
import {WorkspaceMemberInvite} from '../Model/Workspace/WorkspaceMemberInvite';
import {WorkspaceMemberInvite2} from '../Model/Workspace/WorkspaceMemberInvite2';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class WorkspaceMemberEndpoint extends Endpoint {

    public async getByWorkspace(workspaceId: string): Promise<CollectionResult<WorkspaceMember>> {

        let cmd: string = '/workspaces/' + workspaceId + '/members';

        const parser = (rawMember: any): WorkspaceMember => {
            const member: WorkspaceMember = new WorkspaceMember();
            member.id = rawMember.id;
            member.email = rawMember.email;
            member.invite = Utils.isTrue(rawMember.invite);
            if (rawMember.last_login !== null && rawMember.last_login !== undefined) {
                member.last_login = Utils.parseRawDate(rawMember.last_login);
            }
            member.name = rawMember.name;
            member.role = WorkspaceMemberRole.fromString(rawMember.role);

            if (member.invite) {
                member.state = WorkspaceMemberInviteState.fromString(rawMember.state);
            } else {
                member.state = State.fromString(rawMember.state);
            }
            return member;
        }
        const result: CollectionResult<WorkspaceMember> = await this.requestCollection(cmd, parser);

        return result;

    }

    public async invite(workspaceId: string, invites: WorkspaceMemberInvite[]): Promise<boolean> {

        let cmd: string = '/workspaces/' + workspaceId + '/invites';

        const rawInvites: { email: string, role: string }[] = [];
        for (let invite of invites) {
            rawInvites.push({email: invite.email, role: invite.role.toString()});
        }

        try {

            const parser = (raw: any): any => {
                return raw;
            }
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

        let cmd: string = '/workspaces/invites/' + inviteCode;

        const rawInvite: ObjectResult<WorkspaceMemberInvite2> = await this.requestObject(cmd, null, WorkspaceMemberInvite2.parse, 'GET', false);
        if (rawInvite !== null) {

            return rawInvite.getData();
        }

        return null;

    }

    public async getWorkspaceMemberEvents(workspaceId: string, memberId: string): Promise<CollectionResult<UserAction>> {

        try {

            const url: string = '/workspaces/' + workspaceId + '/members/' + memberId + '/events';

            const result: CollectionResult<UserAction> = await this.requestCollection(url, WorkspaceMemberEndpoint.parse, null, 'GET');

            return result
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load adapter configuration: ', error);
            }
            throw error;
        }
    }

    private static parse(rawUserEvent: any): UserAction {
        const userAction: UserAction = new UserAction();

        userAction.id = rawUserEvent.id;
        userAction.userId = rawUserEvent.user;
        userAction.workspaceId = rawUserEvent.workspace;
        userAction.action = rawUserEvent.action;
        userAction.resourceId = rawUserEvent.resource;
        userAction.resourceType = rawUserEvent.resource_type;
        userAction.description = rawUserEvent.description;
        userAction.ip = rawUserEvent.ip;
        userAction.time = Utils.parseRawDate(rawUserEvent.time);
        userAction.result = rawUserEvent.result;
        userAction.data = DataValueCollection.fromObject(rawUserEvent.data);

        return userAction;
    }
}
