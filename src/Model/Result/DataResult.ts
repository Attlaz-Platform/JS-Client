import {ResultError} from './ResultError';

export class DataResult {
    private data: any;
    private errors: ResultError[];

    public constructor() {
        this.data = {};
        this.errors = [];
    }

    public static parse(raw: any): DataResult {
        const result: DataResult = new DataResult();
        console.log('Parse', raw);
        const data: any = raw.data;
        result.setData(data);

        const errors: any[] = raw.errors;
        for (const error of errors) {
            result.addError(error);
        }

        return result;
    }

    public setData(data: any): void {
        this.data = data;
    }

    public getData(): any {
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
