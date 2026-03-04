import {QueryString} from '../Http/Data/QueryString.js';
import {ProviderToken} from '../Model/ProviderToken/ProviderToken.js';
import {ProviderTokenAccessToken} from '../Model/ProviderToken/ProviderTokenAccessToken.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class ProviderTokenEndpoint extends Endpoint {

    public async getProviderToken(providerTokenId: string): Promise<ProviderToken | null> {
        const queryString: QueryString = new QueryString('/provider-tokens/' + providerTokenId);

        const result: ObjectResult<ProviderToken> = await this.requestObject(queryString, null, ProviderToken.parse);
        return result.getData();
    }

    public async getProviderTokenAccessToken(providerTokenId: string): Promise<ProviderTokenAccessToken | null> {
        const queryString: QueryString = new QueryString('/provider-tokens/' + providerTokenId + '/access-token');

        const result: ObjectResult<ProviderTokenAccessToken> = await this.requestObject(queryString, null, ProviderTokenAccessToken.parse);
        return result.getData();
    }

    public async revokeProviderToken(providerTokenId: string): Promise<boolean> {
        const queryString: QueryString = new QueryString('/provider-tokens/' + providerTokenId);


        try {
            const parser = (raw: any): { deleted: boolean } => ({deleted: raw.deleted});

            const result: ObjectResult<{
                deleted: boolean
            }> = await this.requestObject(queryString, null, parser, 'DELETE');

            const re: { deleted: boolean } | null = result.getData();
            if (re === null) {
                throw new Error('Unable to revoke provider token: wrong response from API');
            }
            return re.deleted;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to revoke provider token: ', e);
            }
            throw e;
        }
    }
}
