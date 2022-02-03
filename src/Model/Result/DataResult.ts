import {ResultError} from './ResultError';

export class DataResult<T> {
    private data: T;
    private errors: ResultError[];

    public constructor() {
        this.data = null;
        this.errors = [];
    }

    public static parse<T>(raw: any): DataResult<T> {
        const result: DataResult<T> = new DataResult<T>();
        const data: any = raw.data;
        result.setData(data);

        if (data.hasOwnProperty('errors')) {
            const errors: any[] = raw.errors;
            for (const error of errors) {
                result.addError(error);
            }
        }
        
        return result;
    }

    public setData(data: T): void {
        this.data = data;
    }

    public getData(): T {
        return this.data;
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
