import {Endpoint} from './Endpoint.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {UserAccessToken} from '../Model/AccessToken/UserAccessToken.js';

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


}
