export class ClientError implements Error {
    message: string;
    name: string;
    code: string;
    stack: string;

    constructor(message: string) {
        this.message = message;
        this.code = "";
    }

    public static fromError(error: Error | any): ClientError {
        const clientError: ClientError = new ClientError(error.message);
        clientError.name = error.name;
        clientError.stack = error.stack;

        if (error.code !== null && error.code !== undefined) {
            clientError.code = error.code;
        }

        return clientError;
    }

}
