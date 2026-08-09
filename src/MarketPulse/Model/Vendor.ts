import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A shop whose products Market Pulse tracks — your own or a competitor's. It is the same entity in
 * both roles; a {@link Competitor} is a vendor as one catalog watches it.
 *
 * One vendor is one storefront view: a single `url`, a single `currency`. A merchant selling in
 * several markets is several vendors.
 */
export class Vendor {
    public id: string;
    public name: string;
    /** Storefront root, scheme included, no trailing slash — e.g. `https://shop.com/nl`. */
    public url: string = '';
    public icon: string | null = null;
    /** ISO 4217 code this storefront quotes prices in. */
    public currency: string | null = null;
    /** Platform hint used to pick a scrape strategy, e.g. `shopify`. */
    public type: string | null = null;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static parse(raw: ApiRecord): Vendor {
        const vendor: Vendor = new Vendor(raw.id as string, (raw.name as string | undefined) ?? '');
        vendor.url = (raw.url as string | undefined) ?? '';
        vendor.icon = (raw.icon as string | undefined) ?? null;
        vendor.currency = (raw.currency as string | undefined) ?? null;
        vendor.type = (raw.type as string | undefined) ?? null;

        return vendor;
    }
}
