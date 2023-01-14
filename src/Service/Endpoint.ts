import {OAuthClient} from '../Http/OAuthClient';
import {DataResult} from '../Model/Result/DataResult';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {HttpClient} from '../Http/HttpClient';

export abstract class Endpoint {
    protected httpClient: OAuthClient;

    public constructor(httpClient: OAuthClient) {
        this.httpClient = httpClient;
    }

    public async requestCollection<T>(action: string, parameters: any = null, parser: (input: any) => T, method: string = 'GET', signWithOauthToken: boolean = true): Promise<CollectionResult<T>> {
        const requestResponse: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

        const result: CollectionResult<T> = new CollectionResult<T>();

        /**
         * Parse errors
         */
        // DataResult.appendErrors(result, requestResponse);

        /**
         * Parse data
         */
        if (!requestResponse.hasOwnProperty('data') || requestResponse.data === undefined) {
            throw new Error('Unable to parse collection: data is not defined');
        }

        result.setData(this.parseCollection(requestResponse.data, parser));

        return result;
    }

    public async requestObject<T>(action: string, parameters: any = null, parser: (input: any) => T, method: string = 'GET', signWithOauthToken: boolean = true): Promise<ObjectResult<T>> {
        const result: ObjectResult<T> = new ObjectResult<T>();
        try {
            let requestResponse: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

            // TODO: add errors
            /**
             * Parse errors
             */
// TODO: temporary check untill we know the API is fully upgraded
            if (requestResponse.hasOwnProperty('data') && requestResponse.data !== undefined) {
                console.error('Response for object "' + action + '" seem to still use old "data" property', {requestResponse});
                requestResponse = requestResponse.data;
            }
            result.setData(parser(requestResponse));

        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                result.setData(null);
            }
            throw error;
        }
        return result;
    };

    public async request<T>(action: string, parameters: any = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<DataResult<T>> {
        const result: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

        return DataResult.parse<T>(result);
    }

    public parseCollection<T>(dataResult: DataResult<any>, parser: (input: any) => T): T[] {
        const data: T[] = [];

        const rawData: T[] = dataResult.getData();
        for (const rawDataEntry of rawData) {
            data.push(parser(rawDataEntry));
        }

        dataResult.setData(data);

        return data;
    }
}
