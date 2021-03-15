import {DataResult, Endpoint, User, Utils} from '..';
import {UserAuthProvider} from '../Model/User/UserAuthProvider';

export class UserEndpoint extends Endpoint {

    public async getUser(): Promise<User> {

        let cmd: string = '/user';

        const rawUser: any = await this.httpClient.request(cmd);
        if (Utils.isNullOrUndefined(rawUser)) {
            return null;
        }

        return User.parse(rawUser);

    }

    public async authenticateByAuthProvider(provider: string, data: any): Promise<any> {
        try {

            const result: any = await this.httpClient.request('/auth/providers/' + provider, data, 'POST', false);
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to perform social auth: ', e);
            }
            throw e;
        }
    }

    public async getAuthProviders(): Promise<DataResult<UserAuthProvider[]>> {

        let cmd: string = '/auth/providers';

        const rawAuthProviders: DataResult<any[]> = await this.request<any[]>(cmd);

        rawAuthProviders.setData(this.parseCollection(rawAuthProviders, UserAuthProvider.parse));

        return rawAuthProviders;

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

    public async create(user: User, invitationCode: string | null = null): Promise<DataResult<{ createdUser: User }>> {
        try {
            let url: string = '/user/';
            const data: {} = {user, invitation_code: invitationCode};
            const result: DataResult<{ createdUser: User }> = await this.request(url, data, 'PUT', false);
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
