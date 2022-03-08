import {HttpClient} from '../../Http/HttpClient';

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

            const clientErrorByStatus: ClientError | null = this.byStatus(statusCode, body);
            if (clientErrorByStatus !== null) {
                clientError = clientErrorByStatus;
            }

        } else {
            if (error.code !== null && error.code !== undefined) {
                if (error.code === 'EUNAVAILABLE') {
                    clientError.code = HttpClient.HTTP_UNAVAILABLE;
                }
                if (error.code === 'EAUTH') {
                    clientError.code = HttpClient.HTTP_UNAUTHORIZED;
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
            case 201:
            case 202:
                return null;
                break;
            case 400:
                return new ClientError('Bad Request', HttpClient.HTTP_BAD_REQUEST);
                break;
            case 401:
                return new ClientError('Unauthorized', HttpClient.HTTP_UNAUTHORIZED);
                break;
            case 404:
                return new ClientError('Not Found', HttpClient.HTTP_NOTFOUND);
                break;
            case 404:
                return new ClientError('Unprocessable Entity', HttpClient.HTTP_UNPROCESSABLE_ENTITY);
                break;
            case 405:
                return new ClientError('Not allowed', HttpClient.HTTP_NOT_ALLOWED);
                break;
            case 500:
                return new ClientError('Internal Server Error', HttpClient.HTTP_NOTFOUND);
                break;
            case 503:
                return new ClientError('Service not available', HttpClient.HTTP_UNAVAILABLE);
                break;
            default:
                console.error('Unknown status code "' + statusCode + '"', {code: statusCode, text: statusText});
                return new ClientError('Status code ' + statusCode + ': ' + statusText, HttpClient.HTTP_ERROR);

        }
        return null;
    }

}
