import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {EntityId} from '../Model/EntityId.js';


export class LoadAllHelper {
    public static async loadAll<T extends {
        id: string | EntityId
    }>(call: (pagination: CursorPagination) => Promise<CollectionResult<T>>, limit: number = 100): Promise<T[]> {
        const totalResult: T[] = [];

        let hasMore: boolean = true;
        let lastRef: string | null = null;
        while (hasMore) {
            const firstPagination: CursorPagination = new CursorPagination();
            firstPagination.limit = limit;
            firstPagination.startingAfter = lastRef;
            const data: CollectionResult<T> = await call(firstPagination);
            const records: T[] = data.getData();
            // Spread is faster than a per-element loop but can exceed the call stack for very large collections (50k+)
            if (totalResult.length + records.length > 50_000) {
                throw new Error('loadAll exceeded 50,000 records (' + (totalResult.length + records.length) + '). This method is not intended for large datasets.');
            }
            totalResult.push(...records);
            if (records.length > 0) {
                lastRef = records[records.length - 1].id.toString();
            }

            hasMore = data.hasMore;
        }
        return totalResult;
    }
}
