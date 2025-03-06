export class ApiError extends Error {
    public httpStatus: number | null = null;

    public type: string;
    public code: string;
    // public message: string;

    public param?: string | undefined = undefined;

    public stack?: string;
    public message: string;
    public response: unknown;

    constructor(message: string, httpErrorCode: number | null = null) {
        super(message);
        this.message = message;
        this.httpStatus = httpErrorCode;
    }
}
