import {DataResult, Endpoint, Member, State, User, Utils} from '..';

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

    public async socialAuth(provider: string, data: any): Promise<any> {
        try {

            const result: any = await this.httpClient.request('/auth/social/' + provider, data, 'POST', false);
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to perform social auth: ', e);
            }
            throw e;
        }
    }

    public async update(user: User): Promise<User> {
        try {
            let url: string = '/user/' + user.id;
            const result: any = await this.httpClient.request(url, user, 'POST');
            return User.parse(result);
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }

    public async create(user: User): Promise<DataResult<{ createdUser: User }>> {
        try {
            let url: string = '/user/';
            const result: DataResult<{ createdUser: User }> = await this.request(url, user, 'PUT', false);
            if (!Utils.isNullOrUndefined(result.getData().createdUser)) {
                result.setData({createdUser: User.parse(result.getData().createdUser)})
            }

            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create user: ', e);
            }
            throw e;
        }
    }
}
