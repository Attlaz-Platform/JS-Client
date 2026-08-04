import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {MatchHistory} from '../Model/MatchHistory.js';
import {MatchHistoryBucket} from '../Model/MatchHistoryBucket.js';
import {MatchHistoryInterval} from '../Model/MatchHistoryInterval.js';
import {ProductMatch} from '../Model/ProductMatch.js';
import {ReviewMatch} from '../Model/ReviewMatch.js';
import {ReviewMatchFilters} from '../Model/ReviewMatchFilters.js';

/**
 * Product matches — reviewing the queue, accepting or declining a match, and the history of how
 * the queue has moved.
 */
export class ProductMatchEndpoint extends Endpoint {

    /** The review queue of a catalog; pending matches unless `statuses` says otherwise. */
    public async getForReview(catalogId: CatalogId | string, pagination: CursorPagination | null = null, filters: ReviewMatchFilters = {}): Promise<CollectionResult<ReviewMatch>> {
        const queryString: QueryString = new QueryString('/pulse/catalogs/' + catalogId.toString() + '/matches');
        queryString.set('status', (filters.statuses ?? ['pending']).join(','));
        if (filters.competitor) {
            queryString.set('competitor', filters.competitor);
        }
        if (filters.gtin) {
            queryString.set('gtin', filters.gtin);
        }
        if (filters.search) {
            queryString.set('search', filters.search);
        }
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, ReviewMatch.parse);
    }

    /** The match record, or null. */
    public async getById(matchId: string): Promise<ProductMatch | null> {
        const result: ObjectResult<ProductMatch> = await this.requestObject(
            '/pulse/matches/' + matchId,
            null,
            ProductMatch.parse,
            'GET',
        );

        return result.getData();
    }

    /** Confirm a match. `note` records why, for the reviewer's own audit trail. */
    public async accept(matchId: string, note: string | null = null): Promise<void> {
        await this.requestObject(
            '/pulse/matches/' + matchId + '/accept',
            note === null ? {} : {note},
            (raw: unknown): unknown => raw,
            'POST',
        );
    }

    /** Reject a match, so it stops counting towards the competitor's price index. */
    public async decline(matchId: string, note: string | null = null): Promise<void> {
        await this.requestObject(
            '/pulse/matches/' + matchId + '/decline',
            note === null ? {} : {note},
            (raw: unknown): unknown => raw,
            'POST',
        );
    }

    /** How many matches were discovered and reviewed over time, optionally for one competitor. */
    public async getHistory(catalogId: CatalogId | string, competitor: string | null = null, interval: MatchHistoryInterval = 'day'): Promise<MatchHistory> {
        const queryString: QueryString = new QueryString('/pulse/catalogs/' + catalogId.toString() + '/matches/history');
        queryString.set('interval', interval);
        if (competitor !== null) {
            queryString.set('competitor', competitor);
        }

        const result: ObjectResult<MatchHistory> = await this.requestObject(
            queryString,
            null,
            (raw: Record<string, unknown>): MatchHistory => {
                const buckets: Record<string, unknown>[] = (raw.buckets as Record<string, unknown>[] | undefined) ?? [];
                const snapshot: Record<string, unknown> = (raw.snapshot as Record<string, unknown> | undefined) ?? {};

                return {
                    interval: (raw.interval as MatchHistoryInterval | undefined) ?? interval,
                    buckets: buckets.map((bucket: Record<string, unknown>): MatchHistoryBucket => ({
                        date: new Date(bucket.date as string),
                        discovered: (bucket.discovered as number | undefined) ?? 0,
                        manualAccepted: (bucket.manual_accepted as number | undefined) ?? 0,
                        manualDeclined: (bucket.manual_declined as number | undefined) ?? 0,
                    })),
                    snapshot: {
                        pending: (snapshot.pending as number | undefined) ?? 0,
                        accepted: (snapshot.accepted as number | undefined) ?? 0,
                        declined: (snapshot.declined as number | undefined) ?? 0,
                    },
                };
            },
            'GET',
        );

        return result.getData() ?? {interval, buckets: [], snapshot: {pending: 0, accepted: 0, declined: 0}};
    }
}
