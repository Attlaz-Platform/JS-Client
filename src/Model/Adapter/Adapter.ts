import {MetaDataWithIconAware} from '../../Core/MetaDataWithIconAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class Adapter extends MetaDataWithIconAware {
    public id: string;
    public vendor: string;
    public logo: string | null;
    public type: string;
    public longDescription: string | null;
    public capabilities: string[];
    public categoryIds: string[];
    public docs: string | null;
    public website: string | null;

    public static parse(rawAdapter: ApiRecord): Adapter {
        const adapter: Adapter = MetaDataWithIconAware.parseMetaData(new Adapter(), rawAdapter);

        // adapter.id = rawAdapter.id as string;
        // adapter.name = rawAdapter.name as string;
        // adapter.description = rawAdapter.description as string;
        adapter.vendor = rawAdapter.vendor as string;

        adapter.longDescription = rawAdapter.long_description as string | null;
        adapter.capabilities = rawAdapter.capabilities as unknown as string[];

        // adapter.icon = rawAdapter.icon as string;
        adapter.logo = MetaDataWithIconAware.parseIcon(rawAdapter.logo);
        adapter.type = rawAdapter.type as string;
        adapter.categoryIds = rawAdapter.categories as unknown as string[];
        adapter.docs = rawAdapter.docs as string | null;
        adapter.website = rawAdapter.website as string | null;

        return adapter;
    }


}
