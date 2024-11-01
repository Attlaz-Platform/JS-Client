import {HttpClient} from './HttpClient.js';

export class ClientError extends Error {
    public code: number | null;
    public name: string;
    public stack?: string = undefined;

    constructor(name: string, code: number | null = null) {
        super(name);
        this.name = name;
        this.code = code;
    }

    public static fromError(error: Error | any): ClientError {
        if (error.body !== undefined && error.body !== null && error.body.error !== undefined && error.body.error !== null) {
            error = error.body.error;
        }

        let message: string = error;
        if (error.message !== undefined && error.message !== null) {
            message = error.message;
        }

        let clientError: ClientError = new ClientError(message);

        // console.error(error);

        if (error.status !== null && error.status !== undefined) {
            const statusCode: number = error.status;
            const {body} = error;

            const clientErrorByStatus: ClientError | null = this.byStatus(statusCode, body);
            if (clientErrorByStatus !== null) {
                clientError = clientErrorByStatus;
            }
        } else if (error.code !== null && error.code !== undefined) {
            switch (error.code) {
                case 'EUNAVAILABLE':
                    clientError.code = HttpClient.HTTP_UNAVAILABLE;
                    break;
                case 'EAUTH':
                case 401:
                    clientError.code = HttpClient.HTTP_UNAUTHORIZED;
                    break;
                case 'ESTATUS':
                    if (error.message === 'HTTP status 503') {
                        clientError.code = HttpClient.HTTP_UNAVAILABLE;
                    }
                    break;
                case 500:
                    clientError.code = HttpClient.HTTP_INTERNAL_SERVER_ERROR;
                    break;
                default:
                    console.warn('[Client error] Error code `' + error.code + '` not recognised');
                    clientError.code = error.code;
            }
        }
        clientError.name = error.name;

        // TODO: only in debug mode
        clientError.stack = error.stack;

        return clientError;
    }

    public static byStatus(statusCode: number, statusText: string): ClientError | null {
        switch (statusCode) {
            case 200:
            case 201:
            case 202:
                return null;
            case 400:
                return new ClientError('Bad Request', HttpClient.HTTP_BAD_REQUEST);
            case 401:
                return new ClientError('Unauthorized', HttpClient.HTTP_UNAUTHORIZED);
            case 403:
                return new ClientError('Forbidden', HttpClient.HTTP_FORBIDDEN);
            case 404:
                return new ClientError('Not Found', HttpClient.HTTP_NOTFOUND);
            case 405:
                return new ClientError('Not allowed', HttpClient.HTTP_NOT_ALLOWED);
            case 422:
                return new ClientError('Unprocessable Entity', HttpClient.HTTP_UNPROCESSABLE_ENTITY);
            case 500:
                return new ClientError('Internal Server Error', HttpClient.HTTP_INTERNAL_SERVER_ERROR);
            case 502:
                return new ClientError('Bad gateway', HttpClient.HTTP_BAD_GATEWAY);
            case 503:
                return new ClientError('Service not available', HttpClient.HTTP_UNAVAILABLE);
            case 504:
                return new ClientError('Gateway Time-out', HttpClient.HTTP_TIMEOUT);
            default:
                console.error('Unknown status code "' + statusCode + '"', {code: statusCode, text: statusText});
                return new ClientError('Status code ' + statusCode + ': ' + statusText, statusCode);
        }
        return null;
    }
}
