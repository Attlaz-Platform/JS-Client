export class AdapterConnection {
    id: number;
    key: string;
    adapter: string;
    name: string;
    configuration: {
        key: string;
        value: string;
    }[];

    public static parse(rawAdapterConnection: any): AdapterConnection {
        let adapterConnection: AdapterConnection = new AdapterConnection();
        adapterConnection.id = rawAdapterConnection.id;
        adapterConnection.key = rawAdapterConnection.key;
        adapterConnection.adapter = rawAdapterConnection.adapter;
        adapterConnection.name = rawAdapterConnection.name;
        adapterConnection.configuration = rawAdapterConnection.configuration;

        return adapterConnection;
        // adapter.id = rawAdapter.id;
        // adapter.name = rawAdapter.name;
        // adapter.description = rawAdapter.description;
        // adapter.vendor = rawAdapter.vendor;
        // adapter.image = rawAdapter.image;
        // adapter.type = rawAdapter.type;
        // return adapter;

    }
}
