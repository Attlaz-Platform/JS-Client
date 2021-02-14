export class DataResultCollection<T> {
    private data: T[];


    public constructor() {
        this.data = [];

    }

    // public static parse<T>(raw: any): DataResult<T> {
    //     const result: DataResult<T> = new DataResult<T>();
    //     const data: any = raw.data;
    //     result.setData(data);
    //
    //     const errors: any[] = raw.errors;
    //     for (const error of errors) {
    //         result.addError(error);
    //     }
    //
    //     return result;
    // }

    public setData(data: T[]): void {
        this.data = data;
    }

    public getData(): T[] {
        return this.data;
    }


}
