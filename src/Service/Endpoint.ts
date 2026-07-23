import {ClientError} from '../Http/ClientError.js';
import {Parameters} from '../Http/Data/Parameters.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {HttpStatus} from '../Http/HttpStatus.js';
import {ITransport} from '../Http/Transport/ITransport.js';
import {DataValueCollection} from '../Model/DataValueCollection.js';
import {ApiError} from '../Model/Error/ApiError.js';
import {LogStreamId} from '../Model/Log/LogStreamId.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {ObjectWrapper} from '../Model/Result/ObjectWrapper.js';
import {Utils} from '../Utils.js';

export abstract class Endpoint {
    protected httpClient: ITransport;

    public constructor(httpClient: ITransport) {
        this.httpClient = httpClient;
    }

    /**
     * Prepare a request body for sending. Normally the keys are rewritten to the API's snake_case /
     * id-stripped convention (see {@link formatParameters}). A caller that has already shaped the
     * body — or that carries an opaque payload whose keys must NOT be rewritten, such as a flow
     * run's `arguments` — sets `_formatted: true`; then the body is sent verbatim (minus the marker).
     */
    private prepareParameters(parameters: Parameters): Parameters {
        if (parameters !== null && typeof parameters === 'object' && (parameters as { _formatted?: unknown })._formatted === true) {
            const {_formatted, ...rest} = parameters as Record<string, unknown>;
            return rest;
        }
        return this.formatParameters(parameters);
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

        if (typeof data === 'object') {
            // These types need recursive formatting applied to their serialized output.
            if (data instanceof DataValueCollection || data instanceof LogStreamId) {
                return this.formatParameters(data.jsonSerialize());
            }

            if (data instanceof QueryString) {
                return data.getParameters();
            }

            // Duck-type check for JsonSerializable: avoids fragile instanceof checks across
            // ESM module boundaries where class identity can differ between realms.
            if (typeof (data as any).jsonSerialize === 'function') {
                return (data as any).jsonSerialize();
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
        // Intentional: the API expects bare resource names, not ID-suffixed ones.
        // e.g. TypeScript `environmentId` → snake_case `environment_id` → API param `environment`
        if (formattedKey.endsWith('_id')) {
            formattedKey = formattedKey.substring(0, formattedKey.length - '_id'.length);
        }
        // Intentional: same convention for plural IDs.
        // e.g. `categoryIds` → `category_ids` → `categorys` (TODO: handle irregular plurals properly)
        if (formattedKey.endsWith('_ids')) {
            formattedKey = formattedKey.substring(0, formattedKey.length - '_ids'.length) + 's';
        }

        return formattedKey;
    }

    public async requestCollection<T>(action: string | QueryString, parser: (input: any) => T, parameters: Parameters = null, method: string = 'GET', signWithOauthToken: boolean = true): Promise<CollectionResult<T>> {
        parameters = this.prepareParameters(parameters);

        if (action instanceof QueryString) {
            action = action.build();
        }
        let requestResponse: any;
        try {
            requestResponse = await this.httpClient.request(action, parameters, method, signWithOauthToken);

        } catch (error) {
            throw this.toApiError(error);
        }

        const result: CollectionResult<T> = new CollectionResult<T>();

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

    public async requestObject<T>(
        action: string | QueryString,
        parameters: Parameters = null,
        parser: (input: Record<string, any>) => T,
        method: string = 'GET',
        signWithOauthToken: boolean = true,
    ): Promise<ObjectResult<T>> {
        parameters = this.prepareParameters(parameters);
        if (action instanceof QueryString) {
            action = action.build();
        }
        const result: ObjectResult<T> = new ObjectResult<T>();
        let requestResponse: any;
        try {
            requestResponse = await this.httpClient.request(action, parameters, method, signWithOauthToken);
        } catch (error: unknown) {
            if ((error as ApiError).httpStatus === HttpStatus.HTTP_NOTFOUND) {
                result.setData(null);
                return result;
            }
            throw this.toApiError(error);

        }


        // TODO: add errors
        /**
         * Parse errors
         */
        if (requestResponse === null || requestResponse === undefined) {
            throw new ApiError('Unable to parse object: response is empty for action `[' + method + '] ' + action + '`', HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
        }
        result.setData(this.parseObject<T>(requestResponse, parser));

        return result;
    }

    private toApiError(error: unknown): ApiError {
        if (error instanceof ClientError) {
            const apiError: ApiError = new ApiError(error.message, error.httpStatus);

            if (error.response !== null && error.response !== undefined) {
                const response: {
                    data: {
                        error: {
                            type: string | undefined;
                            code: string | undefined;
                            message: string | undefined;
                            param?: string | undefined
                        } | undefined
                    } | undefined
                } = error.response as any;


                if (response.data !== null && response.data !== undefined && response.data.error !== undefined) {
                    if (response.data.error.type !== undefined) {
                        apiError.type = response.data.error.type;
                    }
                    if (response.data.error.code !== undefined) {
                        apiError.code = response.data.error.code;
                    }
                    if (response.data.error.message !== undefined) {
                        apiError.message = response.data.error.message;
                    }
                    if (response.data.error.param !== undefined) {
                        apiError.param = response.data.error.param;
                    }
                }


            }


            return apiError;
        }
        if (this.httpClient.isDebugEnabled()) {
            console.error('Unrecognised error type (not a ClientError)', {error});
        }
        return new ApiError('Unknown Error', HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
    }

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
        // Parse the raw object directly by default. With debug enabled the object is wrapped so
        // that reads of properties the response doesn't contain get reported — useful for spotting
        // schema drift, but too noisy (and a per-object Proxy cost) to run normally.
        // Enable via client.getHttpClient().enableDebug().
        const data: any = this.httpClient.isDebugEnabled() ? ObjectWrapper.wrap(rawObject) : rawObject;
        try {
            return parser(data);
        } catch (error: unknown) {
            // Report through the transport's parse-error handler (defaults to console.error;
            // consumers can route it to a logger / error tracker via Client.setParseErrorHandler).
            this.httpClient.reportParseError('Unable to parse object', {object: rawObject, error});
            // In debug, surface schema drift loudly (dev/tests) by rethrowing. In production,
            // degrade gracefully — return null so the caller skips the row / shows a not-found
            // state, and a single unparseable object never breaks an entire view.
            if (this.httpClient.isDebugEnabled()) {
                throw error;
            }
        }
        return null;
    }
}
