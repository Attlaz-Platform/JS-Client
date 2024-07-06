export class ObjectResult<T> {
    private data: T | null;

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

    public setData(data: T | null): void {
        this.data = data;
    }

    public getData(): T | null {
        return this.data;
    }
}
