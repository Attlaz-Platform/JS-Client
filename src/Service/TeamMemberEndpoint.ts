import {Endpoint} from './Endpoint';
import {DataResult, State, TeamMember, TeamMemberInvite, TeamMemberInviteState, Utils} from '..';
import {TeamMemberRole} from '../Model/Team/TeamMemberRole';

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
                member.state = TeamMemberInviteState.fromString(member.state);
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
            const result: DataResult<void> = await this.request(cmd, {rawInvites}, 'POST');

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

    public async getTeamInviteByCode(inviteCode: string): Promise<TeamMemberInvite | null> {

        let cmd: string = '/teams/invites/' + inviteCode;

        const rawInvite: any = await this.httpClient.request(cmd);
        if (rawInvite !== null) {

            const teamMemberInvite: TeamMemberInvite = rawInvite as TeamMemberInvite;
            return teamMemberInvite;
        }

        return null;

    }

}
