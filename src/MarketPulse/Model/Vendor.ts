import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A shop whose products Market Pulse tracks — your own or a competitor's. It is the same entity in
 * both roles; a {@link Competitor} is a vendor as one catalog watches it.
 */
export class Vendor {
    public id: string;
    public name: string;
    public icon: string | null = null;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static parse(raw: ApiRecord): Vendor {
        const vendor: Vendor = new Vendor(raw.id as string, (raw.name as string | undefined) ?? '');
        vendor.icon = (raw.icon as string | undefined) ?? null;

        return vendor;
    }
}
