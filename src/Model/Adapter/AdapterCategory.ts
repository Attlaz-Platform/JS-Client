import {ApiRecord} from '../ApiRecord.js';

export class AdapterCategory {
    public id: string;
    public slug: string;
    public name: string;

    public static parse(rawAdapterCategory: ApiRecord): AdapterCategory {
        const adapterCategory: AdapterCategory = new AdapterCategory();
        adapterCategory.id = rawAdapterCategory.id as string;
        adapterCategory.slug = rawAdapterCategory.slug as string;
        adapterCategory.name = rawAdapterCategory.name as string;
        return adapterCategory;
    }
}
