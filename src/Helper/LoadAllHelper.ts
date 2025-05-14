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

            for (const record of data.getData()) {
                totalResult.push(record);
                lastRef = record.id.toString();
            }

            hasMore = data.hasMore;
        }
        return totalResult;
    }
}
