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

        // Already a ClientError (or a subclass such as ApiError) — preserve it as-is.
        if (error instanceof ClientError) {
            return error;
        }

        // The transport uses fetch, which throws TypeError on network failures (DNS, refused
        // connection, TLS, etc.). Anything else reaching here is unexpected — surface it as a
        // generic 500 while keeping the original name/stack for debugging.
        const clientError: ClientError = error instanceof TypeError
            ? new ClientError('Service not available', HttpStatus.HTTP_UNAVAILABLE)
            : new ClientError('Unknown error', HttpStatus.HTTP_INTERNAL_SERVER_ERROR);

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
