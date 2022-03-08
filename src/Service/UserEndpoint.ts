import {UserAuthProvider} from '../Model/User/UserAuthProvider';
import {OAuthClientToken} from '../Http/OAuthClientToken';
import {Endpoint} from './Endpoint';
import {User} from '../Model/User';
import {Utils} from '../Utils';
import {DataResult} from '../Model/Result/DataResult';

export class UserEndpoint extends Endpoint {

    public async getUser(): Promise<User> {

        let cmd: string = '/user';

        const rawUser: any = await this.httpClient.request(cmd);
        if (Utils.isNullOrUndefined(rawUser)) {
            throw new Error('User not found');
        }

        return User.parse(rawUser);

    }

    public async authenticateByAuthProvider(providerType: string, data: { code: string; state: string }): Promise<OAuthClientToken> {
        try {

            const result: any = await this.httpClient.request('/auth/providers/' + providerType, data, 'POST', false);

            // TODO: should we validate this more?
            const token: OAuthClientToken = result as OAuthClientToken;
            token.expires = new Date(result.expires);
            return token;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to perform social auth: ', e);
            }
            throw e;
        }
    }

    public async createAuthProvider(providerType: string, data: { code: string; state: string }): Promise<boolean> {
        try {

            const result: any = await this.httpClient.request('/user/auth/providers', {provider_type: providerType, code: data.code, state: data.state}, 'POST');
            return true;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to assign auth provider: ', e);
            }
            throw e;
        }
    }

    public async removeAuthProvider(providerId: number): Promise<boolean> {
        try {

            const result: any = await this.httpClient.request('/user/auth/providers', {provider: providerId}, 'DELETE');
            return true;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to assign auth provider: ', e);
            }
            throw e;
        }
    }

    public async getAuthProviders(): Promise<DataResult<UserAuthProvider[]>> {

        let cmd: string = '/user/auth/providers';

        const rawAuthProviders: DataResult<any[]> = await this.request<any[]>(cmd);

        rawAuthProviders.setData(this.parseCollection(rawAuthProviders, UserAuthProvider.parse));

        return rawAuthProviders;

    }

    public async update(user: User): Promise<User> {
        try {
            let url: string = '/user/' + user.id;
            const result: any = await this.httpClient.request(url, {user}, 'POST');
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

            const resultData: any | null = result.getData();
            if (resultData !== null && resultData.createdUser !== null) {
                result.setData({createdUser: User.parse(resultData.createdUser)})
            }

            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create user: ', e);
            }
            throw e;
        }
    }

    public async requestResetPassword(email: string): Promise<boolean> {
        try {
            let url: string = '/users/resetpassword';
            const result: any = await this.httpClient.request(url, {email}, 'POST', false);
            return true;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }

    public async resetPassword(code: string, password: string): Promise<boolean> {
        try {
            let url: string = '/users/resetpassword/' + code;
            const result: any = await this.httpClient.request(url, {password}, 'POST', false);
            return true;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }
}
