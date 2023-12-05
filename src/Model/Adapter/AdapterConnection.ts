export class AdapterConnection {
    id: string;
    key: string;
    adapter: string;
    name: string;
    projectId: string;
    status: string;

    public constructor() {
    }

    public static parse(rawAdapterConnection: any): AdapterConnection {
        const adapterConnection: AdapterConnection = new AdapterConnection();
        adapterConnection.id = rawAdapterConnection.id;
        adapterConnection.key = rawAdapterConnection.key;
        adapterConnection.adapter = rawAdapterConnection.adapter;
        adapterConnection.name = rawAdapterConnection.name;
        adapterConnection.projectId = rawAdapterConnection.project;
        adapterConnection.status = rawAdapterConnection.status;
        return adapterConnection;
    }
}
