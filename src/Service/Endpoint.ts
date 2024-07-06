import {OAuthClient} from '../Http/OAuthClient.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {HttpClient} from '../Http/HttpClient.js';
import {Utils} from '../Utils.js';
import {ObjectWrapper} from '../Model/Result/ObjectWrapper.js';
import {DataValueCollection} from '../Model/DataValueCollection.js';
import {JsonSerializable} from '../Model/JsonSerializable.js';
import {Parameters} from '../Http/Data/Parameters.js';
import {LogStreamId} from '../Model/Log/LogStreamId.js';
import {QueryString} from '../Http/Data/QueryString.js';

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
                data instanceof DataValueCollection
                || data instanceof LogStreamId
            ) {
                return this.formatParameters(data.jsonSerialize());
            }

            if (data instanceof QueryString) {
                return data.getParameters();
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
        if (formattedKey.endsWith('_ids')) {
            // TODO: update this to format correct plurals (for example category_ids should become categories instead of categorys)
            formattedKey = formattedKey.substring(0, formattedKey.length - '_ids'.length) + 's';
        }

        return formattedKey;
    }

    public async requestCollection<T>(action: string | QueryString, parser: (input: any) => T, parameters: Parameters = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<CollectionResult<T>> {
        parameters = this.formatParameters(parameters);

        if (action instanceof QueryString) {
            action = action.build();
        }

        const requestResponse: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

        const result: CollectionResult<T> = new CollectionResult<T>();

        /**
         * Parse errors
         */
        // DataResult.appendErrors(result, requestResponse);

        /**
         * Parse data
         */
        if (requestResponse === null || requestResponse === undefined) {
            throw new Error('Unable to parse collection: response is empty for action `[' + method + '] ' + action + '`');
        }
        if (!Object.prototype.hasOwnProperty.call(requestResponse, 'data') || requestResponse.data === undefined) {
            throw new Error('Unable to parse collection: data is not defined in response from action `[' + method + '] ' + action + '`');
        }
        if (!Object.prototype.hasOwnProperty.call(requestResponse, 'has_more') || requestResponse.has_more === undefined) {
            throw new Error('Unable to parse collection: hasMore is not defined in response from action `[' + method + '] ' + action + '`');
        }

        const hasMore: boolean = Utils.isTrue(requestResponse.has_more);

        result.setData(this.parseCollection<T>(requestResponse.data, parser), hasMore);

        return result;
    }

    public async requestObject<T>(action: string | QueryString, parameters: Parameters = null, parser: (input: {
        [k: string]: any
    }) => T, method: string = 'GET', signWithOauthToken: boolean = true): Promise<ObjectResult<T>> {
        parameters = this.formatParameters(parameters);
        if (action instanceof QueryString) {
            action = action.build();
        }
        const result: ObjectResult<T> = new ObjectResult<T>();
        try {
            let requestResponse: any = await this.httpClient.request(action, parameters, method, signWithOauthToken);

            // TODO: add errors
            /**
             * Parse errors
             */
            // TODO: temporary check until we know the API is fully upgraded
            if (requestResponse === null || requestResponse === undefined) {
                throw new Error('Unable to parse object: response is empty for action `[' + method + '] ' + action + '`');
            }
            if ((Object.prototype.hasOwnProperty.call(requestResponse, 'data') && !Object.prototype.hasOwnProperty.call(requestResponse, 'id')) && requestResponse.data !== undefined) {
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
    }

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
            const parsedObject: T | null = this.parseObject<T>(rawDataEntry, parser);
            if (parsedObject !== null) {
                data.push(parsedObject);
            }
        }

        return data;
    }

    private parseObject<T>(rawObject: any, parser: (input: any) => T): T | null {
        // TODO: is it interesting to keep this wrapper, or only in develop mode?
        const wrappedData: any = ObjectWrapper.wrap(rawObject);
        try {
            return parser(wrappedData);
        } catch (e: any) {
            console.error('Unable to parse: ' + e.message);
        }
        return null;
    }

    // public static getAll(): CollectionResult<T> {
    //
    // }
}
