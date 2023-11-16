import {DataValueCollection} from '../DataValueCollection.js';

export class AdapterConnection {
    id: string;
    key: string;
    adapter: string;
    name: string;
    projectId: string;
    configuration: DataValueCollection;

    public constructor() {
        this.configuration = new DataValueCollection();
    }

    public static parse(rawAdapterConnection: any): AdapterConnection {
        const adapterConnection: AdapterConnection = new AdapterConnection();
        adapterConnection.id = rawAdapterConnection.id;
        adapterConnection.key = rawAdapterConnection.key;
        adapterConnection.adapter = rawAdapterConnection.adapter;
        adapterConnection.name = rawAdapterConnection.name;
        adapterConnection.projectId = rawAdapterConnection.project;
        adapterConnection.configuration = DataValueCollection.fromObject(rawAdapterConnection.configuration);

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
