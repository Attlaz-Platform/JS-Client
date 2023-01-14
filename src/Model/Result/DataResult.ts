import {ResultError} from './ResultError';

export class DataResult<T> {
    private data: T | null;
    private readonly errors: ResultError[];

    public constructor(data: T | null = null) {
        this.data = data;
        this.errors = [];
    }

    private static parseResponse(raw: any) {
        if (raw === null || raw === undefined) {
            throw new Error('Unable to parse response: empty');
        }
    }

    public static appendErrors(result: DataResult<any>, rawResponse: any): void {
        if (rawResponse.hasOwnProperty('errors')) {
            if (rawResponse.errors === undefined || rawResponse.errors === null) {
                console.error('Unable to parse DataResult: errors defined but invalid value', rawResponse);
            } else {
                const errors: any[] = rawResponse.errors;
                for (const error of errors) {
                    result.addError(error);
                }
            }
        }
    }

    private static appendData(result: DataResult<any>, rawResponse: any): void {
        if (!rawResponse.hasOwnProperty('data') || rawResponse.data === undefined) {
            throw new Error('Unable to parse DataResult: data is not defined');
        } else {
            result.setData(rawResponse.data);
        }
    }

    public static parse<T>(raw: any): DataResult<T> {
        const result: DataResult<T> = new DataResult<T>();
        if (raw === null || raw === undefined) {
            throw new Error('Unable to parse DataResult: result: empty');
        }

        DataResult.appendErrors(result, raw);

        return result;
    }

    public setData(data: T): void {
        this.data = data;
    }

    public getData(): T {
        if (this.data === null) {
            throw new Error('Data is empty');
        }
        return this.data;
    }

    public hasData(): boolean {
        return this.data !== null;
    }

    public addError(error: ResultError): void {
        this.errors.push(error);
    }

    public getErrors(): ResultError[] {
        return this.errors;
    }

    public hasErrors() {
        return this.errors.length > 0;
    }

    public getOutput(): any {
        return {data: this.data, errors: this.errors};
    }

}
