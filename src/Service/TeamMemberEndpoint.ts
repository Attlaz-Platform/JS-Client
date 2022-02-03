import {Endpoint} from './Endpoint';
import {TeamMemberInvite2} from '../Model/Team/TeamMemberInvite2';
import {TeamMember} from '../Model/Team/TeamMember';
import {Utils} from '../Utils';
import {TeamMemberRole} from '../Model/Team/TeamMemberRole';
import {TeamMemberInviteState} from '../Model/Team/TeamMemberInviteState';
import {State} from '../Model/State';
import {TeamMemberInvite} from '../Model/Team/TeamMemberInvite';
import {DataResult} from '../Model/Result/DataResult';

export class TeamMemberEndpoint extends Endpoint {

    public async getByTeam(teamId: string): Promise<TeamMember[]> {

        let cmd: string = '/teams/' + teamId + '/members';

        const rawMembers: any[] = await this.httpClient.request(cmd);

        const result: TeamMember[] = [];
        for (let rawMember of rawMembers) {
            const member: TeamMember = new TeamMember();
            member.id = rawMember.id;
            member.email = rawMember.email;
            member.invite = Utils.isTrue(rawMember.invite);
            member.last_login = Utils.parseRawDate(rawMember.last_login);
            member.name = rawMember.name;
            member.role = TeamMemberRole.fromString(rawMember.role);

            if (member.invite) {
                member.state = TeamMemberInviteState.fromString(rawMember.state);
            } else {
                member.state = State.fromString(rawMember.state);
            }
            result.push(member);
        }
        return result;

    }

    public async invite(teamId: string, invites: TeamMemberInvite[]): Promise<DataResult<void>> {

        let cmd: string = '/teams/' + teamId + '/invites';

        const rawInvites: { email: string, role: string }[] = [];
        for (let invite of invites) {
            rawInvites.push({email: invite.email, role: invite.role.toString()});
        }

        try {
            const result: DataResult<void> = await this.request(cmd, {invites: rawInvites}, 'POST');

            if (Utils.isNullOrUndefined(result)) {
                return null;
            }

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to invite members to team "' + teamId + '": ', ex);
            }

            throw ex;
        }

    }

    public async getTeamInviteByCode(inviteCode: string): Promise<TeamMemberInvite2 | null> {

        let cmd: string = '/teams/invites/' + inviteCode;

        const rawInvite: any = await this.httpClient.request(cmd, null, 'GET', false);
        if (rawInvite !== null) {

            const teamMemberInvite: TeamMemberInvite2 = {
                code: rawInvite.code,
                email: rawInvite.email,
                inviter_name: rawInvite.inviter_name,
                inviter_email: rawInvite.inviter_email,
                team_name: rawInvite.team_name,
                state: TeamMemberInviteState.fromString(rawInvite.state)
            };

            return teamMemberInvite;
        }

        return null;

    }

}
