import {Utils} from '../Utils';

export class PagedResult<T> {
    public pageSize: number;
    public totalCount: number;
    public data: Array<T>;

    public constructor(data: Array<T>, pageSize: number = null, totalCount: number = null) {

        this.data = data;

        if (Utils.isNullOrUndefined(pageSize)) {
            pageSize = data.length;
        }
        this.pageSize = pageSize;

        if (Utils.isNullOrUndefined(totalCount)) {
            totalCount = data.length;
        }
        this.totalCount = totalCount;
    }
}
