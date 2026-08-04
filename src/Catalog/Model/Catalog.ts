import {ApiRecord} from '../../Model/ApiRecord.js';
import {CatalogId} from './CatalogId.js';

/**
 * A catalog: the product selection an app works on — the `/catalogs` resource. Market Pulse,
 * Data Enrichment, Feed Management and Data Quality all read one.
 *
 * `source` is the connection the products are imported from (null for a catalog filled by a flow),
 * `vendor` is the vendor the catalog's own products belong to.
 */
export class Catalog {
    public id: CatalogId;
    public project: string;
    public name: string;
    public description: string | null = null;
    public source: string | null = null;
    public vendor: string | null = null;

    public constructor(id: CatalogId, project: string, name: string) {
        this.id = id;
        this.project = project;
        this.name = name;
    }

    public static parse(raw: ApiRecord): Catalog {
        const catalog: Catalog = new Catalog(
            new CatalogId(raw.id as string),
            raw.project as string,
            raw.name as string,
        );
        catalog.description = (raw.description as string | undefined) ?? null;
        catalog.source = (raw.source as string | undefined) ?? null;
        catalog.vendor = (raw.vendor as string | undefined) ?? null;

        return catalog;
    }
}
