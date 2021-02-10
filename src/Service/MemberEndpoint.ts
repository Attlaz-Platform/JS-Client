import {Endpoint} from './Endpoint';
import {DataResult, Member, State, TeamInvite, User, Utils} from '..';

export class MemberEndpoint extends Endpoint {

    public async getByTeam(teamId: string): Promise<Member[]> {

        let cmd: string = '/teams/' + teamId + '/members';

        const rawMembers: any[] = await this.httpClient.request(cmd);

        const result: Member[] = [];
        for (let rawMember of rawMembers) {

            const user: User = User.parse(rawMember.user);
            const role = rawMember.role;
            const member: Member = new Member(user, role);
            member.state = State.fromString(rawMember.state);
            result.push(member);
        }
        return result;

    }

    public async invite(teamId: string, invites: TeamInvite[]): Promise<DataResult<void>> {

        let cmd: string = '/teams/' + teamId + '/invite';

        try {
            const result: DataResult<void> = await this.request(cmd, {invites}, 'POST');

            if (Utils.isNullOrUndefined(result)) {
                return null;
            }

            // result.setData(Channel.parse(result.getData()));
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to invite members to team "' + teamId + '": ', ex);
            }

            throw ex;
        }

        // this.httpClient.request(cmd, invites, 'POST').then((rawProject: any) => {
        //
        //     resolve(Project.parse(rawProject));
        //
        // }).catch((reason: any) => {
        //     if (this.httpClient.isDebugEnabled()) {
        //         console.error('Failed to save project: ', reason);
        //     }
        //     reject(reason);
        // });

    }

}
