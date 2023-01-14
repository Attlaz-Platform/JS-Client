import {UserAuthProvider} from '../Model/User/UserAuthProvider';
import {OAuthClientToken} from '../Http/OAuthClientToken';
import {Endpoint} from './Endpoint';
import {User} from '../Model/User';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class UserEndpoint extends Endpoint {

    public async getUser(): Promise<User | null> {

        let cmd: string = '/user';

        const rawUser: ObjectResult<User> = await this.requestObject(cmd, null, User.parse);
        return rawUser.getData();

    }

    public async authenticateByAuthProvider(providerType: string, data: { code: string; state: string }): Promise<OAuthClientToken> {
        try {

            const result: any = await this.request('/auth/providers/' + providerType, data, 'POST', false);

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

            const result: any = await this.request('/user/auth/providers', {provider_type: providerType, code: data.code, state: data.state}, 'POST');
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

            const result: any = await this.request('/user/auth/providers', {provider: providerId}, 'DELETE');
            return true;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to assign auth provider: ', e);
            }
            throw e;
        }
    }

    public async getAuthProviders(): Promise<CollectionResult<UserAuthProvider>> {

        let cmd: string = '/user/auth/providers';

        const rawAuthProviders: CollectionResult<UserAuthProvider> = await this.requestCollection<UserAuthProvider>(cmd, null, UserAuthProvider.parse);

        return rawAuthProviders;

    }

    public async update(user: User): Promise<User> {
        try {
            let url: string = '/user/' + user.id;
            const result: ObjectResult<User> = await this.requestObject(url, {user}, User.parse, 'POST');
            const updatedUser: User | null = result.getData();
            if (updatedUser === null) {
                throw new Error('User not updated');
            }
            return updatedUser;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }

    public async create(user: User, invitationCode: string | null = null): Promise<User> {
        try {
            let url: string = '/user/';
            const data: {} = {user, invitation_code: invitationCode};

            const parser = (raw: any): User => {
                return User.parse(raw.createdUser)
            }
            const result: ObjectResult<User> = await this.requestObject(url, data, parser, 'PUT', false);

            const createdUser: User | null = result.getData();
            if (createdUser === null) {
                throw new Error('User not created');
            }
            return createdUser;
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
            const result: any = await this.request(url, {email}, 'POST', false);
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
            const result: any = await this.request(url, {password}, 'POST', false);
            return true;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }
}
