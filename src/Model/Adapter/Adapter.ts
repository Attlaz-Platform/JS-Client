export class Adapter {
    public id: string;
    public name: string;
    public description: string;
    public vendor: string;
    public icon: string;
    public logo: string;
    public type: string;
    public categoryIds: string[];
    public docs: string;
    public website: string;

    public static parse(rawAdapter: any): Adapter {
        let adapter: Adapter = new Adapter();
        adapter.id = rawAdapter.id;
        adapter.name = rawAdapter.name;
        adapter.description = rawAdapter.description;
        adapter.vendor = rawAdapter.vendor;
        adapter.icon = rawAdapter.icon;
        adapter.logo = rawAdapter.logo;
        adapter.type = rawAdapter.type;
        adapter.categoryIds = rawAdapter.categories;
        adapter.docs = rawAdapter.docs;
        adapter.website = rawAdapter.website;

        return adapter;

    }
}
