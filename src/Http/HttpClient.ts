import {Response} from 'servie';
import {fetch} from 'popsicle';
import {ClientError} from '../Model/Error/ClientError';
import {HttpClientRequest} from './HttpClientRequest';

export class HttpClient {

    public static HTTP_UNAUTHORIZED: string = '401';
    public static HTTP_NOTFOUND: string = '404';
    public static HTTP_UNAVAILABLE: string = '503';

    public static async get(url: string, requestData: any = {}): Promise<any> {
        if (requestData === undefined || requestData === null) {
            requestData = {};
        }
        const response: Response = await fetch(url, requestData);

        //TODO: validate status

        const error: ClientError = ClientError.byStatus(response.status, response.statusText);
        if (error !== null && error !== undefined) {
            throw error;
        }

        // TODO: make it possible to do request without parsing the json
        return await response.json();
    }

    public static async request(request: HttpClientRequest): Promise<any> {
        return HttpClient.get(request.url, request as any);
    }
}
