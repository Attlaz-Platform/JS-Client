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

    /**
     * Type guard: true when `error` is a ClientError (or a subclass such as ApiError). Use it to
     * narrow before reading typed fields (`httpStatus`, `message`, …). Relies on instanceof, which
     * is reliable when there's a single copy of this package (e.g. a bundled web app). For a status
     * check that must survive multiple package copies / realm boundaries, prefer statusOf().
     */
    public static is(error: unknown): error is ClientError {
        return error instanceof ClientError;
    }

    /**
     * The HTTP status carried by a ClientError/ApiError, or null for anything else (e.g. a plain
     * Error or a non-error value). Robust across module/realm boundaries: when instanceof fails
     * (two copies of this package in one process) it falls back to reading a numeric httpStatus
     * field. This is the safe way to ask "what status did this error carry?".
     */
    public static statusOf(error: unknown): number | null {
        if (error instanceof ClientError) {
            return error.httpStatus;
        }
        const status: unknown = (error as { httpStatus?: unknown } | null)?.httpStatus;
        return typeof status === 'number' ? status : null;
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
