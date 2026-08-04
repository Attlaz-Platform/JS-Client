import {Catalog} from '../../Catalog/Model/Catalog.js';
import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A feed generated from a catalog and published to a connection — the `/catalogs/:catalogId/feeds`
 * resource (a `ResourceFeed` server-side).
 *
 * `source` and `destination` are ids unless the request expands them; `expand=source` fills
 * {@link source}, and the destination connection is left raw because its shape depends on the
 * adapter.
 */
export class CatalogFeed {
    public id: string;
    public name: string;
    public description: string = '';
    public status: string = '';
    /** When this feed last ran; null if it never has. */
    public lastRunAt: Date | null = null;

    public sourceId: string | null = null;
    public destinationId: string | null = null;

    /** Set only when the request asked for `expand=source`. */
    public source: Catalog | null = null;
    /** Set only when the request asked for `expand=destination`; shape varies per adapter. */
    public destination: Record<string, unknown> | null = null;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static parse(raw: ApiRecord): CatalogFeed {
        const feed: CatalogFeed = new CatalogFeed(raw.id as string, raw.name as string);
        feed.description = (raw.description as string | undefined) ?? '';
        feed.status = (raw.status as string | undefined) ?? '';
        feed.lastRunAt = raw.last_run_at ? new Date(raw.last_run_at as string) : null;

        // Both arrive as a bare id, or as the full object when expanded.
        const source: unknown = raw.source;
        if (typeof source === 'string') {
            feed.sourceId = source;
        } else if (source !== null && typeof source === 'object') {
            feed.source = Catalog.parse(source as ApiRecord);
            feed.sourceId = feed.source.id.toString();
        }

        const destination: unknown = raw.destination;
        if (typeof destination === 'string') {
            feed.destinationId = destination;
        } else if (destination !== null && typeof destination === 'object') {
            feed.destination = destination as Record<string, unknown>;
            feed.destinationId = (feed.destination.id as string | undefined) ?? null;
        }

        return feed;
    }
}
