import {OAuthClient} from '..';
import {DataResult} from '../Model/Result/DataResult';

export abstract class Endpoint {
    protected httpClient: OAuthClient;

    public constructor(httpClient: OAuthClient) {
        this.httpClient = httpClient;
    }

    public async request(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<DataResult> {
        const result: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

        return DataResult.parse(result);
    }
}
