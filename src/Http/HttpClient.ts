import {Response} from 'servie';
import {fetch} from 'popsicle';
import {HttpClientRequest} from './HttpClientRequest';
import {Utils} from '../Utils';
import {ClientError} from '..';
import {HttpClientResponse} from './HttpClientResponse';

export class HttpClient {

    public static HTTP_ERROR: string = 'xxx';
    public static HTTP_BAD_REQUEST: string = '400';
    public static HTTP_UNAUTHORIZED: string = '401';
    public static HTTP_NOTFOUND: string = '404';
    public static HTTP_NOT_ALLOWED: string = '405';
    public static HTTP_UNPROCESSABLE_ENTITY: string = '422';
    public static HTTP_UNAVAILABLE: string = '503';

    public static async get(url: string, requestData: any = {}): Promise<any> {
        if (Utils.isNullOrUndefined(requestData)) {
            requestData = {};
        }
        const response: Response = await fetch(url, requestData);

        //TODO: validate status

        const error: ClientError = ClientError.byStatus(response.status, response.statusText);
        if (!Utils.isNullOrUndefined(error)) {

            // const body: string = await response.text();
            // console.log('Text' + body);
            //
            // console.log(response);
            throw error;
        }

        // TODO: make it possible to do request without parsing the json
        return await response.json();
    }

    public static async request(request: HttpClientRequest): Promise<any> {

        const rawRequest: any = {
            url: request.getFullUrl(),
            method: request.method,
            headers: request.headers,
            omitDefaultHeaders: true,
            body: request.body
        };

        return HttpClient.get(request.url, rawRequest);
    }

    public static async request2(request: HttpClientRequest): Promise<HttpClientResponse> {

        const rawRequest: any = {
            url: request.getFullUrl(),
            method: request.method,
            headers: request.headers,
            omitDefaultHeaders: true,
            body: request.body
        };

        const response: Response = await fetch(request.url, rawRequest);

        const httpResponse: HttpClientResponse = new HttpClientResponse();
        httpResponse.status = response.status;
        httpResponse.statusText = response.statusText;
        // TODO: should we get JSON immediately?
        // response.json
        // httpResponse.body = await response.text();
        httpResponse.body = await response.json();

        const error: ClientError = ClientError.byStatus(response.status, response.statusText);
        if (!Utils.isNullOrUndefined(error)) {

            // const body: string = await response.text();
            // console.log('Text' + body);
            //
            // console.log(response);
            throw error;
        }

        // //TODO: validate status
        //
        // const error: ClientError = ClientError.byStatus(response.status, response.statusText);
        // if (!Utils.isNullOrUndefined(error)) {
        //
        //     // const body: string = await response.text();
        //     // console.log('Text' + body);
        //     //
        //     // console.log(response);
        //     throw error;
        // }
        //
        // // TODO: make it possible to do request without parsing the json
        // return await response.json();

        return httpResponse;

    }
}
