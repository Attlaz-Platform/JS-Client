import {LoadAllHelper} from './LoadAllHelper.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

type Record = { id: string };

const page = (ids: string[], hasMore: boolean): CollectionResult<Record> =>
    new CollectionResult<Record>(ids.map((id: string): Record => ({id})), hasMore);

describe('LoadAllHelper', () => {
    test('walks every page and returns all records', async () => {
        const pages: CollectionResult<Record>[] = [page(['a', 'b'], true), page(['c'], false)];
        let calls: number = 0;

        const all: Record[] = await LoadAllHelper.loadAll<Record>(async () => pages[calls++]!);

        expect(all.map((record: Record): string => record.id)).toEqual(['a', 'b', 'c']);
        expect(calls).toBe(2);
    });

    test('passes the last id of the previous page as the cursor', async () => {
        const cursors: (string | null)[] = [];
        const pages: CollectionResult<Record>[] = [page(['a', 'b'], true), page(['c'], false)];
        let calls: number = 0;

        await LoadAllHelper.loadAll<Record>(async (pagination: CursorPagination) => {
            cursors.push(pagination.startingAfter);
            return pages[calls++]!;
        });

        expect(cursors).toEqual([null, 'b']);
    });

    test('returns nothing for an empty collection', async () => {
        const all: Record[] = await LoadAllHelper.loadAll<Record>(async () => page([], false));

        expect(all).toEqual([]);
    });

    // An empty page that still claims hasMore cannot be paged past — the cursor comes from the last
    // record, so the same request would repeat forever. Fail instead of hanging the caller.
    test('throws when the API reports more results but returns an empty page', async () => {
        let calls: number = 0;

        await expect(LoadAllHelper.loadAll<Record>(async () => {
            calls++;
            return page([], true);
        })).rejects.toThrow('returned an empty page');

        expect(calls).toBe(1);
    });

    test('refuses to collect more than 50,000 records', async () => {
        const ids: string[] = Array.from({length: 30_000}, (_value: unknown, index: number): string => String(index));

        await expect(LoadAllHelper.loadAll<Record>(async () => page(ids, true)))
            .rejects.toThrow('exceeded 50,000 records');
    });
});
