import {HttpClient} from '../..';

export class ClientError implements Error {
    message: string;
    name: string;
    code: string;
    stack: string;

    constructor(message: string, code: string = '') {
        this.message = message;
        this.code = code;
    }

    public static fromError(error: Error | any): ClientError {
        let clientError: ClientError = new ClientError(error.message);

        //console.error(error);

        if (error.status !== null && error.status !== undefined) {
            const statusCode: number = error.status;
            const body: string = error.body;
            clientError = this.byStatus(statusCode, body)

        } else {
            if (error.code !== null && error.code !== undefined) {
                if (error.code === 'EUNAVAILABLE') {
                    clientError.code = HttpClient.HTTP_UNAVAILABLE;
                }
                    // if (error.code === 'ESTATUS' && error.message === 'HTTP status 503') {
                    //     clientError.code = HttpClient.HTTP_UNAVAILABLE;
                // }
                else {
                    clientError.code = error.code;
                }

            }
        }
        clientError.name = error.name;
        clientError.stack = error.stack;

        return clientError;
    }

    public static byStatus(statusCode: number, statusText: string): ClientError | null {
        switch (statusCode) {
            case 200:
                return null;
                break;
            case 401:
                //Unauthorized
                // console.error('401: ' + statusText);
                return new ClientError('Unauthorized', HttpClient.HTTP_UNAUTHORIZED);
                break;
            case 404:
                //Unauthorized
                // console.error('404:' + statusText);
                return new ClientError('Not Found', HttpClient.HTTP_NOTFOUND);
                break;
            case 500:
                //Unauthorized
                // console.error('500: ' + statusText);
                return new ClientError('Internal Server Error', HttpClient.HTTP_NOTFOUND);
                break;
            case 503:
                //Unauthorized
                // console.error('500: ' + statusText);
                return new ClientError('Service not available', HttpClient.HTTP_UNAVAILABLE);
                break;
            default:
                console.error('Unknown status code "' + status + '"');

        }
        return null;
    }

}
