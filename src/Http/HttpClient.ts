import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
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
        const response: HttpClientResponse = await HttpClient.axiosRequest(request);
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

    private static async axiosRequest(request: HttpClientRequest): Promise<HttpClientResponse> {
        const requestConfig: AxiosRequestConfig = {
            url: request.getFullUrl(),
            method: request.method,
            headers: request.headers,
            data: request.body,
        };
        // TODO: should we share this instance between requests?
        const axiosInstance: AxiosInstance = axios.create();

        const rawResponse: AxiosResponse = await axiosInstance.request(requestConfig);


        const httpResponse: HttpClientResponse = new HttpClientResponse(rawResponse.status, rawResponse.statusText);

        Object.keys(rawResponse.headers).forEach((header: string) => {
            const headerValue: any | null = rawResponse.headers[header];
            httpResponse.headers[header] = headerValue === null ? '' : headerValue;
        });
        httpResponse.body = await rawResponse.data;
        return httpResponse;
    }

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
