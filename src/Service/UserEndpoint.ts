import {Endpoint, User} from "..";

export class UserEndpoint extends Endpoint {

    public async getUser(): Promise<User> {

        let cmd: string = '/user';

        const rawUser: any = await this.httpClient.request(cmd);

        return User.parse(rawUser);

    }

    public async getUsersByTeam(teamId: string): Promise<User[]> {

        let cmd: string = '/teams/' + teamId + '/users';

        const rawUsers: any[] = await this.httpClient.request(cmd);

        const result: User[] = [];
        for (let rawUser of rawUsers) {
            result.push(User.parse(rawUser));
        }
        return result;

    }
}
