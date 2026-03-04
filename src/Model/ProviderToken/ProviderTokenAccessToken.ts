import {ApiRecord} from '../ApiRecord.js';

export class ProviderTokenAccessToken {
    public accessToken:string;

    public static parse(rawToken: ApiRecord): ProviderTokenAccessToken {
        const token = new ProviderTokenAccessToken();
        token.accessToken = rawToken.access_token as string;
        return token;
    }
}
