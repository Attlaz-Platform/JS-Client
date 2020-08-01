import {Endpoint, Member, State, User, Utils} from "..";

export class UserEndpoint extends Endpoint {

    public async getUser(): Promise<User> {

        let cmd: string = '/user';

        const rawUser: any = await this.httpClient.request(cmd);
        if (Utils.isNullOrUndefined(rawUser)) {
            return null;
        }

        return User.parse(rawUser);

    }

    public async getUsersByTeam(teamId: string): Promise<Member[]> {

        let cmd: string = '/teams/' + teamId + '/users';

        const rawMembers: any[] = await this.httpClient.request(cmd);

        const result: Member[] = [];
        for (let rawMember of rawMembers) {

            const user: User = User.parse(rawMember);
            const role = rawMember.role;
            const member: Member = new Member(user, role);
            member.state = State.fromString(rawMember.state);
            result.push(member);
        }
        return result;

    }

    public save(user: User): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/user';

            this.httpClient.request(url, user, 'POST').then((result: any) => {

                resolve(result);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save user: ', reason);
                }
                reject(reason);
            });

        });
    }
}
