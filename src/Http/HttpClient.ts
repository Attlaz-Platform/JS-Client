import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {ClientError} from './ClientError.js';

export class HttpClient {
    private static readonly axiosInstance: AxiosInstance = axios.create();

    public static async request(request: HttpClientRequest): Promise<HttpClientResponse> {
        return HttpClient.axiosRequest(request);
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

        try {
            const rawResponse: AxiosResponse = await HttpClient.axiosInstance.request(requestConfig);
            const httpResponse: HttpClientResponse = new HttpClientResponse(rawResponse.status, rawResponse.statusText);

            Object.keys(rawResponse.headers).forEach((header: string) => {
                const headerValue: string | string[] | null = rawResponse.headers[header] as string | string[] | null;
                httpResponse.headers[header] = headerValue === null ? '' : headerValue;
            });
            httpResponse.body = rawResponse.data;
            return httpResponse;
        } catch (requestError: unknown) {
            throw ClientError.fromError(requestError as Error);
        }
    }


}
