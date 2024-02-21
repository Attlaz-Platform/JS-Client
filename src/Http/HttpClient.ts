import {Response} from 'servie';
import {fetch} from 'popsicle';
import {RequestOptions as BrowserRequestOptions} from 'servie/dist/browser.js';
import {RequestOptions as NodeRequestOptions} from 'servie/dist/node.js';
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
        const rawRequest: any = {
            url: request.getFullUrl(),
            method: request.method,
            headers: request.headers,
            omitDefaultHeaders: true,
            body: request.body,
        } as BrowserRequestOptions | NodeRequestOptions;

        const response: Response = await fetch(request.getFullUrl(), rawRequest);

        const httpResponse: HttpClientResponse = new HttpClientResponse(response.status, response.statusText);

        const contentType: { type: string, options: string | null } = this.getContentType(response);

        const rawData: string = await response.text();
        if (contentType.type === 'application/json') {
            let jsonData: object | null = null;
            if (rawData !== '') {
                try {
                    jsonData = JSON.parse(rawData);
                } catch (e) {
                    console.error('Unable to parse response data to JSON', {
                        statusText: httpResponse.statusText, error: e,
                    });
                }
            }

            httpResponse.body = jsonData;
        } else {
            httpResponse.body = rawData;
        }


        for (const header of response.headers.keys()) {
            httpResponse.headers[header] = response.headers.get(header);
        }


        const error: ClientError | null = ClientError.byStatus(response.status, response.statusText);
        if (error !== null && error !== undefined) {
            if (httpResponse.body !== null && httpResponse.body !== undefined && httpResponse.body.error !== null && httpResponse.body.error !== undefined && httpResponse.body.error.message !== null && httpResponse.body.error.message !== undefined
            ) {
                error.message = httpResponse.body.error.message;
            }

            throw error;
        }

        return httpResponse;
    }

    private static getContentType(response: Response): { type: string, options: string | null } {
        if (response.headers.has('Content-Type')) {
            const rawContentType: string | null = response.headers.get('Content-Type');
            if (rawContentType !== null) {
                return this.formatContentType(rawContentType);
            }
        }
        return {type: 'application/json', options: null};
    }

    private static formatContentType(input: string): { type: string, options: string | null } {
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
