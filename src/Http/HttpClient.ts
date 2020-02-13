import {Response} from 'servie';
import {fetch} from 'popsicle';
import {ClientError} from '../Model/Error/ClientError';
import {HttpClientRequest} from './HttpClientRequest';

export class HttpClient {
    public static async get(url: string, requestData: any): Promise<any> {
        const response: Response = await fetch(url, requestData);

        //TODO: validate status
        switch (response.status) {
            case 401:
                //Unauthorized
                console.error(response.statusText);
                throw new ClientError('Unauthorized');
                break;
        }

        const body: any = await response.json();
        return body;
    }

    public static async request(request: HttpClientRequest): Promise<any> {

        return HttpClient.get(request.url, request as any);

    }
}
