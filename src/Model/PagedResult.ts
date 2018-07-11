export class PagedResult<T> {
    public pageSize: number;
    public totalCount: number;
    public data: Array<T>;

    public constructor(data: Array<T>, pageSize: number = null, totalCount: number = null) {

        this.data = data;

        if (pageSize === null || pageSize === undefined) {
            pageSize = data.length;
        }
        this.pageSize = pageSize;

        if (totalCount === null || totalCount === undefined) {
            totalCount = data.length;
        }
        this.totalCount = totalCount;
    }
}