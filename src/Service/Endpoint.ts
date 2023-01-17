import {OAuthClient} from '../Http/OAuthClient';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {HttpClient} from '../Http/HttpClient';
import {Utils} from '../Utils';
import {ObjectWrapper} from '../Model/Result/ObjectWrapper';
import {DataValueCollection} from '../Model/DataValueCollection';
import {JsonSerializable} from '../Model/JsonSerializable';
import {Parameters} from '../Http/Data/Parameters';
import {LogStreamId} from '../Model/Log/LogStreamId';

export abstract class Endpoint {
    protected httpClient: OAuthClient;

    public constructor(httpClient: OAuthClient) {
        this.httpClient = httpClient;
    }

    private formatParameters(data: any | null = null): any {
        if (data === null || data === undefined) {
            return null;
        }

        if (Array.isArray(data)) {
            const result: any[] = [];
            for (const value of data) {
                result.push(this.formatParameters(value));
            }
            return result;
        }

        if (Utils.isDate(data)) {
            return data.toISOString();
        }

        // tODo: this does not seem to work correclty
        if (data instanceof JsonSerializable && 'jsonSerialize' in data) {
            return data.jsonSerialize();
        }
        if (typeof data === 'object') {

            if (
                // data instanceof WorkspaceId ||
                // data instanceof ProjectEnvironmentId ||
                // data instanceof ProjectId ||
                // data instanceof OrganisationId ||
                // data instanceof FlowId ||
                // data instanceof FlowRunId ||
                // data instanceof UserId ||
                // data instanceof DataCollectionResult ||
                // data instanceof SuccessResult ||
                data instanceof DataValueCollection ||
                data instanceof LogStreamId
            ) {
                return this.formatParameters(data.jsonSerialize());
            }

            const result: any = {};

            for (const [key, value] of Object.entries(data)) {
                const formattedKey: string = this.formatKey(key);

                result[formattedKey] = this.formatParameters(value);

            }
            return result;
        }

        return data;

    }

    private formatKey(key: string): string {
        let formattedKey: string = key.replace(/([A-Z])/g, ' $1');
        formattedKey = formattedKey.split(' ').join('_').toLowerCase();
        if (formattedKey.endsWith('_id')) {
            formattedKey = formattedKey.substring(0, formattedKey.length - '_id'.length);
        }

        return formattedKey;
    }

    public async requestCollection<T>(action: string, parameters: Parameters = null, parser: (input: any) => T, method: string = 'GET', signWithOauthToken: boolean = true): Promise<CollectionResult<T>> {
        parameters = this.formatParameters(parameters);
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
        if (!requestResponse.hasOwnProperty('has_more') || requestResponse.has_more === undefined) {
            throw new Error('Unable to parse collection: hasMore is not defined');
        }

        const hasMore: boolean = Utils.isTrue(requestResponse.has_more);

        result.setData(this.parseCollection<T>(requestResponse.data, parser), hasMore);

        return result;
    }

    public async requestObject<T>(action: string, parameters: Parameters = null, parser: (input: any) => T, method: string = 'GET', signWithOauthToken: boolean = true): Promise<ObjectResult<T>> {
        parameters = this.formatParameters(parameters);
        const result: ObjectResult<T> = new ObjectResult<T>();
        try {
            let requestResponse: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

            // TODO: add errors
            /**
             * Parse errors
             */
            // TODO: temporary check until we know the API is fully upgraded
            if ((requestResponse.hasOwnProperty('data') && !requestResponse.hasOwnProperty('id')) && requestResponse.data !== undefined) {
                console.error('Response for object "' + action + '" seem to still use old "data" property', {requestResponse});
                requestResponse = requestResponse.data;
            }
            result.setData(this.parseObject<T>(requestResponse, parser));

        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                result.setData(null);
            } else {
                throw error;
            }
        }
        return result;
    };

    // public async request<T>(action: string, parameters: any | null = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<DataResult<T>> {
    //     const result: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);
    //
    //     return DataResult.parse<T>(result);
    // }

    public parseCollection<T>(rawData: object[], parser: (input: any) => T): T[] {
        const data: T[] = [];

        if (!Array.isArray(rawData)) {
            throw new Error('Invalid data');
        }
        for (const rawDataEntry of rawData) {

            data.push(this.parseObject<T>(rawDataEntry, parser));
        }

        return data;

    }

    private parseObject<T>(rawObject: any, parser: (input: any) => T): T {
        // TODO: is it interesting to keep this wrapper, or only in develop mode?
        const wrappedData: any = ObjectWrapper.wrap(rawObject);
        const parsedData: T = parser(wrappedData);
        return parsedData;
    }
}
