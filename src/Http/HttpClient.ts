import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
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
        };
        if (request.body !== null && request.body !== undefined) {
            requestConfig.data = request.body;
        }

        // TODO: should we share this instance between requests?
        const axiosInstance: AxiosInstance = axios.create();

        // TODo: should we catch axios error sand make them into ClientErrors?
        try {
            const rawResponse: AxiosResponse = await axiosInstance.request(requestConfig);
            const httpResponse: HttpClientResponse = new HttpClientResponse(rawResponse.status, rawResponse.statusText);

            Object.keys(rawResponse.headers).forEach((header: string) => {
                const headerValue: any | null = rawResponse.headers[header];
                httpResponse.headers[header] = headerValue === null ? '' : headerValue;
            });
            httpResponse.body = await rawResponse.data;
            return httpResponse;
        } catch (e) {
            if (e instanceof AxiosError) {
                const status: number = e.status === undefined ? 500 : e.status;
                const statusCode: string = e.code === undefined ? 'Error' : e.code;

                const response: HttpClientResponse = new HttpClientResponse(status, statusCode);
                if (e.response !== undefined) {
                    response.body = e.response.data;
                }
                return response;
            }
            console.error('Unable to perform request', {error: e});


            const response: HttpClientResponse = new HttpClientResponse(500, '');
            return response;
        }

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
