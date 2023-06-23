export class CollectionResult<T> {
    private data: T[];
    public hasMore: boolean = false;

    public constructor(data: T[] | null = null, hasMore: boolean = false) {
        this.data = data === null ? [] : data;
        this.hasMore = hasMore;
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

    public setData(data: T[], hasMore: boolean): void {
        this.data = data;
        this.hasMore = hasMore;
    }

    public getData(): T[] {
        return this.data;
    }
}
