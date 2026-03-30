import {HttpStatus} from './HttpStatus.js';

export class ClientError extends Error {
    public httpStatus: number | null = null;
    public message: string;
    public response: unknown;

    constructor(message: string, httpErrorCode: number | null = null) {
        super(message);
        this.message = message;
        this.httpStatus = httpErrorCode;
    }

    public static fromError(error: Error): ClientError {

        let clientError: ClientError = new ClientError('Unknown error', HttpStatus.HTTP_INTERNAL_SERVER_ERROR);

        const xError = error as unknown as { status: number; code: number | string; body: string };
        if (xError.status !== null && xError.status !== undefined) {
            const statusCode: number = xError.status;
            const {body} = xError;

            const clientErrorByStatus: ClientError | null = this.byStatus(statusCode, body);
            if (clientErrorByStatus !== null) {
                clientError = clientErrorByStatus;
            }
        } else if (xError.code !== null && xError.code !== undefined) {
            switch (xError.code) {
                case 'EUNAVAILABLE':
                case 'ECONNREFUSED':
                case 'HTTP_UNAVAILABLE':
                    clientError.httpStatus = HttpStatus.HTTP_UNAVAILABLE;
                    break;
                case 'EAUTH':
                case 401:
                    clientError.httpStatus = HttpStatus.HTTP_UNAUTHORIZED;
                    break;
                case 'ESTATUS':
                    if (error.message === 'HTTP status 503') {
                        clientError.httpStatus = HttpStatus.HTTP_UNAVAILABLE;
                    }
                    break;
                case 500:
                    clientError.httpStatus = HttpStatus.HTTP_INTERNAL_SERVER_ERROR;
                    break;
                default:
                    console.warn('[Client error] Error code `' + xError.code + '` not recognised');
                    clientError.httpStatus = HttpStatus.HTTP_INTERNAL_SERVER_ERROR;
            }
        } else if (error instanceof TypeError) {
            // fetch throws TypeError on network failures (ECONNREFUSED, DNS, etc.)
            clientError.httpStatus = HttpStatus.HTTP_UNAVAILABLE;
            clientError.message = 'Service not available';
            return clientError;
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
                return new ClientError('Bad Request', HttpStatus.HTTP_BAD_REQUEST);
            case 401:
                return new ClientError('Unauthorized', HttpStatus.HTTP_UNAUTHORIZED);
            case 403:
                return new ClientError('Forbidden', HttpStatus.HTTP_FORBIDDEN);
            case 404:
                return new ClientError('Not Found', HttpStatus.HTTP_NOTFOUND);
            case 405:
                return new ClientError('Not allowed', HttpStatus.HTTP_NOT_ALLOWED);
            case 422:
                return new ClientError('Unprocessable Entity', HttpStatus.HTTP_UNPROCESSABLE_ENTITY);
            case 500:
                return new ClientError('Internal Server Error', HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
            case 502:
                return new ClientError('Bad gateway', HttpStatus.HTTP_BAD_GATEWAY);
            case 503:
                return new ClientError('Service not available', HttpStatus.HTTP_UNAVAILABLE);
            case 504:
                return new ClientError('Gateway Time-out', HttpStatus.HTTP_TIMEOUT);
            default:
                console.error('Unknown status code "' + statusCode + '"', {code: statusCode, text: statusText});
                return new ClientError('Status code ' + statusCode + ': ' + statusText, statusCode);
        }
    }
}
