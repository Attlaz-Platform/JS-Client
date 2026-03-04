import {ApiRecord} from '../ApiRecord.js';

export class ProviderToken {
    public id: string;
    public state: string;
    public details: {
        name: string,
        id: string,
        icon: string | null,
    } | null;

    public static parse(rawToken: ApiRecord): ProviderToken {
        const token = new ProviderToken();
        token.id = rawToken.id as string;
        token.state = rawToken.state as string;
        token.details = rawToken.details as ProviderToken['details'];
        return token;
    }
}
