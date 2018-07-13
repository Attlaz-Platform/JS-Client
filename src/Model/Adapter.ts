export class Adapter {
    public id: string;
    public name: string;
    public description: string;
    public vendor: string;
    public image: string;
    public type: string;

    public static parse(rawAdapter: any): Adapter {
        let adapter: Adapter = new Adapter();
        adapter.id = rawAdapter.id;
        adapter.name = rawAdapter.name;
        adapter.description = rawAdapter.description;
        adapter.vendor = rawAdapter.vendor;
        adapter.image = rawAdapter.image;
        adapter.type = rawAdapter.type;
        return adapter;

    }
}