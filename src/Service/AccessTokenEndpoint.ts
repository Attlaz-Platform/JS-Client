import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {UserAccessToken} from '../Model/AccessToken/UserAccessToken.js';
import {UserAccessTokenStatus} from '../Model/AccessToken/UserAccessTokenStatus.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class AccessTokenEndpoint extends Endpoint {
    public async getByUser(pagination: CursorPagination, status: UserAccessTokenStatus | null = null): Promise<CollectionResult<UserAccessToken>> {
        const queryString: QueryString = new QueryString('/access-tokens');
        queryString.addPagination(pagination);
        if (status !== null) {
            queryString.set('status', status);
        }
        try {
            const result: CollectionResult<UserAccessToken> = await this.requestCollection(queryString, UserAccessToken.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load user access tokens: ', error);
            }
            throw error;
        }
    }

    public async create(name: string, scopes: string[], expiresAt: Date): Promise<UserAccessToken> {
        try {
            const url: string = '/access-tokens';
            const data = {
                name,
                scopes,
                expires_at: expiresAt,
            };
            const result: ObjectResult<UserAccessToken> = await this.requestObject(url, data, UserAccessToken.parse, 'POST');

            const createdToken: UserAccessToken | null = result.getData();
            if (createdToken === null) {
                throw new Error('Unable to create token: wrong response from API');
            }
            return createdToken;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save token: ', ex);
            }
            throw ex;
        }
    }

    public async update(tokenId: string, name: string): Promise<UserAccessToken> {
        try {
            const url: string = '/access-tokens/' + tokenId;

            const result: ObjectResult<UserAccessToken> = await this.requestObject(url, {
                name,
            }, UserAccessToken.parse, 'POST');

            const updatedToken: UserAccessToken | null = result.getData();
            if (updatedToken === null) {
                throw new Error('Unable to create token: wrong response from API');
            }
            return updatedToken;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save token: ', ex);
            }
            throw ex;
        }
    }

    public async revoke(tokenId: string): Promise<boolean> {
        try {
            const url: string = '/access-tokens/' + tokenId;
            const parser = (raw: any): { revoked: boolean } => ({revoked: raw.revoked});
            const result: ObjectResult<{ revoked: boolean }> = await this.requestObject(url, null, parser, 'DELETE');

            const res: { revoked: boolean } | null = result.getData();
            if (res === null) {
                console.log('Token delete item wrong data', {result, parsed: res});
                throw new Error('Unable to revoke token: wrong response from API');
            }
            return res.revoked;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to revoke token: ', ex);
            }
            throw ex;
        }
    }
}
