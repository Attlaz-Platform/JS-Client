import {UserAuthProvider} from '../Model/User/UserAuthProvider.js';
import {Endpoint} from './Endpoint.js';
import {User} from '../Model/User.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

export class UserEndpoint extends Endpoint {
    public async getUser(): Promise<User | null> {
        const cmd: string = '/users';

        const rawUser: ObjectResult<User> = await this.requestObject(cmd, null, User.parse);
        return rawUser.getData();
    }




    public async removeAuthProvider(providerId: number): Promise<boolean> {
        try {
            const parser = (raw: any): { deleted: boolean } => ({deleted: raw.deleted});
            const result: ObjectResult<{
                deleted: boolean
            }> = await this.requestObject('/users/auth/providers', {provider: providerId}, parser, 'DELETE');
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
        const cmd: string = '/users/auth/providers';

        const rawAuthProviders: CollectionResult<UserAuthProvider> = await this.requestCollection<UserAuthProvider>(cmd, UserAuthProvider.parse);

        return rawAuthProviders;
    }

    public async getPermissions(): Promise<CollectionResult<{ key: string; allowed: boolean }>> {
        const cmd: string = '/permissions';

        const parser = (raw: any): { key: string; allowed: boolean } => ({key: raw.key, allowed: raw.allowed});
        const data: CollectionResult<{ key: string; allowed: boolean }> = await this.requestCollection<{
            key: string; allowed: boolean
        }>(cmd, parser);

        return data;
    }

    public async update(user: User): Promise<User> {
        try {
            const url: string = '/users/' + user.id;
            const result: ObjectResult<User> = await this.requestObject(url, user, User.parse, 'POST');
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

    public async create(user: User, password: string, invitationCode: string | null = null): Promise<User> {
        try {
            const url: string = '/users/';
            const data: any = user;
            data.password = password;
            data.invitation_code = invitationCode;

            const result: ObjectResult<User> = await this.requestObject(url, data, User.parse, 'PUT', false);

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
            const url: string = '/users/resetpassword';

            const parser = (raw: any): { requested: boolean } => ({requested: raw.requested});
            const result: ObjectResult<{
                requested: boolean
            }> = await this.requestObject(url, {email}, parser, 'POST', false);
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
            const url: string = '/users/resetpassword/' + code;
            const parser = (raw: any): { updated: boolean } => ({updated: raw.updated});
            const result: ObjectResult<{
                updated: boolean
            }> = await this.requestObject(url, {password}, parser, 'POST', false);
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
