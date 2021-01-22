import {Endpoint} from './Endpoint';
import {Member, State, User} from '..';

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

}
