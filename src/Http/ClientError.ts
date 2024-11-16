import {AxiosError} from 'axios';
import {HttpStatus} from './HttpStatus.js';

export class ClientError extends Error {
    public httpStatus: number | null = null;

    public type: string;
    public code: string;
    // public message: string;

    public param?: string | undefined = undefined;

    public stack?: string;

    constructor(code: string, httpErrorCode: number | null = null) {
        super(code);
        this.code = code;
        this.httpStatus = httpErrorCode;
    }

    public static fromError(error: Error | AxiosError): ClientError {

        let clientError: ClientError = new ClientError('Unknown error', HttpStatus.HTTP_INTERNAL_SERVER_ERROR);


        if (error instanceof AxiosError) {

            if (error.status !== undefined) {
                clientError.httpStatus = error.status;
            }
            // console.log('Status', clientError.httpStatus);
            // if(clientError.httpStatus === HttpStatusCode.Ref)
            clientError.message = error.message;
            if (error.code !== undefined) {
                clientError.code = error.code;
            }


            if (error.response === undefined) {
                if (error.code === 'ECONNREFUSED') {
                    clientError.message = 'Connection refused';
                } else {
                    console.error('Unable to parse AxiosError response', {error, x: error.status, y: error.code});
                }
            } else {


                //   console.debug('Parse response', {error: error, data: error.response.data});


                switch (error.response.status) {
                    case 404:
                        clientError.code = 'Not found';
                        break;
                    default:
                }


                const errorData: {
                    error: {
                        type: string | undefined;
                        code: string | undefined;
                        message: string | undefined;
                        param?: string | undefined
                    } | undefined
                } = error.response.data;

                if (errorData.error !== undefined) {
                    // console.debug('Error data', errorData);
                    if (errorData.error.type !== undefined) {
                        clientError.type = errorData.error.type;
                    }
                    if (errorData.error.code !== undefined) {
                        clientError.code = errorData.error.code;
                    }
                    if (errorData.error.message !== undefined) {
                        clientError.message = errorData.error.message;
                    }
                    if (errorData.error.param !== undefined) {
                        clientError.param = errorData.error.param;
                    }
                }


            }

            return clientError;
        }

        // if (error.body !== undefined && error.body !== null && error.body.error !== undefined && error.body.error !== null) {
        //     error = error.body.error;
        // }

        // let message: string = error;
        // if (error.message !== undefined && error.message !== null) {
        //     message = error.message;
        // }
        //

        // console.error(error);

        const xError = error as any as { status: number; code: number | string; body: string };
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
