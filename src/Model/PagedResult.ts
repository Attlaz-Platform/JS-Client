export class PagedResult<T> {
    public pageSize: number;
    public totalCount: number;
    public data: Array<T>;

    public constructor(data: Array<T>, pageSize: number | null = null, totalCount: number | null = null) {

        this.data = data;

        if (pageSize === null) {
            pageSize = data.length;
        }
        this.pageSize = pageSize;

        if (totalCount === null) {
            totalCount = data.length;
        }
        this.totalCount = totalCount;
    }
}
