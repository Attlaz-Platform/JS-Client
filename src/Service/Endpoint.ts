import {OAuthClient} from '..';

export abstract class Endpoint {
    protected httpClient: OAuthClient;

    public constructor(httpClient: OAuthClient) {
        this.httpClient = httpClient;
    }
}
