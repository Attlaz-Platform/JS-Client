import {UserAuthProvider} from '../Model/User/UserAuthProvider';
import {OAuthClientToken} from '../Http/OAuthClientToken';
import {Endpoint} from './Endpoint';
import {User} from '../Model/User';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class UserEndpoint extends Endpoint {

    public async getUser(): Promise<User | null> {

        let cmd: string = '/users';

        const rawUser: ObjectResult<User> = await this.requestObject(cmd, null, User.parse);
        return rawUser.getData();

    }

    public async authenticateByAuthProvider(providerType: string, data: { code: string; state: string }): Promise<OAuthClientToken> {
        try {

            const parser = (raw: any): OAuthClientToken => {
                // TODO: should we validate this more?
                const token: OAuthClientToken = raw as OAuthClientToken;
                token.expires = new Date(raw.expires);
                return token;
            }
            const result: ObjectResult<OAuthClientToken> = await this.requestObject('/auth/providers/' + providerType, data, parser, 'POST', false);

            const token: OAuthClientToken | null = result.getData();
            if (token === null) {
                console.log('auth by auth provider wrong data', {result, parsed: token});
                throw new Error('Unable to authenticate by auth provider: wrong response from API');
            }
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

            const parser = (raw: any): {} => {
                return raw;
            }
            const result: ObjectResult<{}> = await this.requestObject('/users/auth/providers', {provider_type: providerType, code: data.code, state: data.state}, parser, 'POST');
            // TODO validation
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
            const parser = (raw: any): { deleted: boolean } => {
                return {deleted: raw.deleted};
            }
            const result: ObjectResult<{ deleted: boolean }> = await this.requestObject('/users/auth/providers', {provider: providerId}, parser, 'DELETE');
            const re: { deleted: boolean } | null = result.getData();
            if (re === null) {
                console.log('remove auth provider wrong data', {result, parsed: re});
                throw new Error('Unable to remove auth provider: wrong response from API');
            }
            return re.deleted;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to assign auth provider: ', e);
            }
            throw e;
        }
    }

    public async getAuthProviders(): Promise<CollectionResult<UserAuthProvider>> {

        let cmd: string = '/users/auth/providers';

        const rawAuthProviders: CollectionResult<UserAuthProvider> = await this.requestCollection<UserAuthProvider>(cmd, null, UserAuthProvider.parse);

        return rawAuthProviders;

    }

    public async getPermissions(): Promise<CollectionResult<{ key: string; allowed: boolean }>> {

        let cmd: string = '/permissions';

        const parser = (raw: any): { key: string; allowed: boolean } => {
            return {key: raw.key, allowed: raw.allowed};
        }
        const data: CollectionResult<{ key: string; allowed: boolean }> = await this.requestCollection<{ key: string; allowed: boolean }>(cmd, null, parser);

        return data;

    }

    public async update(user: User): Promise<User> {
        try {
            let url: string = '/users/' + user.id;
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
            let url: string = '/users/';
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

            const parser = (raw: any): { requested: boolean } => {
                return {requested: raw.requested}
            };
            const result: ObjectResult<{ requested: boolean }> = await this.requestObject(url, {email}, parser, 'POST', false);
            const re: { requested: boolean } | null = result.getData();
            if (re === null) {
                console.log('reset password request wrong data', {result, parsed: re});
                throw new Error('Unable to request password reset: wrong response from API');
            }
            return re.requested;
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
            const parser = (raw: any): { updated: boolean } => {
                return {updated: raw.updated}
            };
            const result: ObjectResult<{ updated: boolean }> = await this.requestObject(url, {password}, parser, 'POST', false);
            const re: { updated: boolean } | null = result.getData();
            if (re === null) {
                console.log('reset password wrong data', {result, parsed: re});
                throw new Error('Unable to reset password: wrong response from API');
            }
            return re.updated;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save user: ', e);
            }
            throw e;
        }
    }
}
