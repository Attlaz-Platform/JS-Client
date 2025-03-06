import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class Adapter extends MetaDataAware {
    public id: string;
    public vendor: string;
    public logo: string;
    public type: string;
    public categoryIds: string[];
    public docs: string | null;
    public website: string | null;

    public static parse(rawAdapter: ApiRecord): Adapter {
        const adapter: Adapter = MetaDataAware.parseMetaData(new Adapter(), rawAdapter);

        adapter.id = rawAdapter.id as string;
        adapter.name = rawAdapter.name as string;
        adapter.description = rawAdapter.description as string;
        adapter.vendor = rawAdapter.vendor as string;
        adapter.icon = rawAdapter.icon as string;
        adapter.logo = rawAdapter.logo as string;
        adapter.type = rawAdapter.type as string;
        adapter.categoryIds = rawAdapter.categories as unknown as string[];
        adapter.docs = rawAdapter.docs as string | null;
        adapter.website = rawAdapter.website as string | null;

        return adapter;
    }
}
