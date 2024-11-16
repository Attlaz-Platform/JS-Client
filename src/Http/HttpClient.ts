import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {ClientError} from './ClientError.js';

export class HttpClient {
    public static async request(request: HttpClientRequest): Promise<HttpClientResponse> {
        const response: HttpClientResponse = await HttpClient.axiosRequest(request);
        // const error: ClientError | null = ClientError.byStatus(response.status, response.statusText);
        // if (error !== null && error !== undefined) {
        //     if (response.body !== null && response.body !== undefined && response.body.error !== null && response.body.error !== undefined && response.body.error.message !== null && response.body.error.message !== undefined
        //     ) {
        //         error.message = response.body.error.message;
        //     }
        //
        //     throw error;
        // }

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
        } catch (requestError) {
            // if (requestError instanceof AxiosError) {
            //     const status: number = requestError.status === undefined ? 500 : requestError.status;
            //     const statusCode: string = requestError.code === undefined ? 'Error' : requestError.code;
            //
            //     const response: HttpClientResponse = new HttpClientResponse(status, statusCode);

            //
            //
            //     throw ClientError.fromError(requestError);

            // }

            throw ClientError.fromError(requestError as any);
        }

    }


}
