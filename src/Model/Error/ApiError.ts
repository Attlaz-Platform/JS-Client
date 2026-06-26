import {ClientError} from '../../Http/ClientError.js';

/**
 * Domain-level error produced at the API/Endpoint boundary. Extends ClientError so a single
 * `instanceof ClientError` catches both transport failures (ClientError) and API errors
 * (ApiError), while adding the server's structured error fields (type/code/param).
 *
 * httpStatus, message and response are inherited from ClientError.
 */
export class ApiError extends ClientError {
    public type: string;
    public code: string;

    public param?: string | undefined = undefined;

    constructor(message: string, httpErrorCode: number | null = null) {
        super(message, httpErrorCode);
    }
}
