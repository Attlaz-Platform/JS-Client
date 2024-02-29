export class AdapterCategory {
    public id: string;
    public slug: string;
    public name: string;

    public static parse(rawAdapterCategory: any): AdapterCategory {
        const adapterCategory: AdapterCategory = new AdapterCategory();
        adapterCategory.id = rawAdapterCategory.id;
        adapterCategory.slug = rawAdapterCategory.slug;
        adapterCategory.name = rawAdapterCategory.name;
        return adapterCategory;
    }
}
