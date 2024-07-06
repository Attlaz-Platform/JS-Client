import {Endpoint} from './Endpoint.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {UserAccessToken} from '../Model/AccessToken/UserAccessToken.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';

export class AccessTokenEndpoint extends Endpoint {
    public async getByUser(pagination: CursorPagination): Promise<CollectionResult<UserAccessToken>> {
        const q: QueryString = new QueryString('/access-tokens');
        q.addPagination(pagination);
        try {
            const result: CollectionResult<UserAccessToken> = await this.requestCollection(q, UserAccessToken.parse);
            return result;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load user access tokens: ' + e);
            }
            throw e;
        }
    }

    public async create(name: string, scopes: string[]): Promise<UserAccessToken> {
        try {
            const url: string = '/access-tokens';

            const result: ObjectResult<UserAccessToken> = await this.requestObject(url, {name, scopes}, UserAccessToken.parse, 'POST');

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

    public async update(tokenId: string, name: string, scopes: string[]): Promise<UserAccessToken> {
        try {
            const url: string = '/access-tokens/' + tokenId;

            const result: ObjectResult<UserAccessToken> = await this.requestObject(url, {name, scopes}, UserAccessToken.parse, 'POST');

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

            const x: { revoked: boolean } | null = result.getData();
            if (x === null) {
                console.log('Token delete item wrong data', {result, parsed: x});
                throw new Error('Unable to revoke token: wrong response from API');
            }
            return x.revoked;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to revoke token: ', ex);
            }
            throw ex;
        }
    }
}
