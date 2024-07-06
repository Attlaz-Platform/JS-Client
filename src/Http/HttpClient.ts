import {Response as PopsicleResponse} from 'servie';
import {fetch} from 'popsicle';
import {CommonRequestOptions} from 'servie/dist/common.js';
// import * as SuperAgent from 'superagent';
import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {ClientError} from './ClientError.js';

export class HttpClient {
    public static HTTP_BAD_REQUEST: number = 400;
    public static HTTP_UNAUTHORIZED: number = 401;
    public static HTTP_FORBIDDEN: number = 403;
    public static HTTP_NOTFOUND: number = 404;
    public static HTTP_NOT_ALLOWED: number = 405;
    public static HTTP_UNPROCESSABLE_ENTITY: number = 422;

    public static HTTP_INTERNAL_SERVER_ERROR: number = 500;
    public static HTTP_BAD_GATEWAY: number = 502;
    public static HTTP_UNAVAILABLE: number = 503;
    public static HTTP_TIMEOUT: number = 504;

    public static async request(request: HttpClientRequest): Promise<HttpClientResponse> {
        const response: HttpClientResponse = await HttpClient.popsicleRequest(request);

        // const response: HttpClientResponse = await HttpClient.superAgentRequest(request);
        const error: ClientError | null = ClientError.byStatus(response.status, response.statusText);
        if (error !== null && error !== undefined) {
            if (response.body !== null && response.body !== undefined && response.body.error !== null && response.body.error !== undefined && response.body.error.message !== null && response.body.error.message !== undefined
            ) {
                error.message = response.body.error.message;
            }

            throw error;
        }

        return response;
    }

    private static async popsicleRequest(request: HttpClientRequest): Promise<HttpClientResponse> {
        const rawRequest: CommonRequestOptions<any> = {
            url: request.getFullUrl(),
            method: request.method,
            headers: request.headers,
            omitDefaultHeaders: true,
            body: request.body,
        } as CommonRequestOptions<any>;


        const rawResponse: PopsicleResponse = await fetch(request.getFullUrl(), rawRequest);
        const httpResponse: HttpClientResponse = new HttpClientResponse(rawResponse.status, rawResponse.statusText);
        for (const header of rawResponse.headers.keys()) {
            const headerValue: string | null = rawResponse.headers.get(header);
            httpResponse.headers[header] = headerValue === null ? '' : headerValue;
        }

        httpResponse.body = await rawResponse.text();

        if (HttpClient.isJson(httpResponse)) {
            let jsonData: object | null = null;
            if (httpResponse.body !== '') {
                try {
                    jsonData = JSON.parse(httpResponse.body);
                } catch (e) {
                    // console.error(, {statusText: httpResponse.statusText, error: e});
                    throw new Error('Unable to parse response data to JSON');
                }
            }
            httpResponse.body = jsonData;
        } else {
            // response.body = rawData;
        }


        return httpResponse;
    }

    // private static async superAgentRequest(request: HttpClientRequest): Promise<HttpClientResponse> {
    //
    //
    //     let x: SuperAgent.Request | null = null;
    //     if (request.method === HttpClientRequest.GET) {
    //         x = SuperAgent.get(request.getFullUrl());
    //     } else if (request.method === HttpClientRequest.POST) {
    //         x = SuperAgent.post(request.getFullUrl());
    //
    //     } else if (request.method === HttpClientRequest.PUT) {
    //         x = SuperAgent.put(request.getFullUrl());
    //     } else {
    //         throw new Error('Unknown request method `' + request.method + '`');
    //     }
    //
    //
    //     if (x === null) {
    //         throw new Error('Hm');
    //     }
    //
    //
    //     for (const key in request.headers) {
    //         if (Object.prototype.hasOwnProperty.call(request.headers, key)) {
    //             console.log('Set ' + key + ': ' + request.headers[key]);
    //             x.set(key, request.headers[key] as string);
    //         }
    //     }
    //
    //
    //     const rawResponse: SuperAgent.Response = await x.send(request.body);
    //
    //
    //     const response: HttpClientResponse = new HttpClientResponse(rawResponse.statusCode, '');
    //     response.body = rawResponse.body;
    //     // TODO: append/validate headers
    //     response.headers = rawResponse.headers;
    //     return response;
    // }

    private static isJson(response: HttpClientResponse): boolean {
        return response.getContentType() === 'application/json';
    }

    public static formatContentType(input: string): { type: string, options: string | null } {
        const d: string[] = input.split(';');
        if (d.length === 1) {
            return {type: d[0], options: null};
        }
        if (d.length === 2) {
            return {type: d[0], options: d[1].trim()};
        }
        console.error('Unable to parse content type "' + input + '"');
        return {type: input, options: null};
    }
}
