import {AdapterConnectionStatus} from './AdapterConnectionStatus.js';

export class AdapterConnection {
    id: string;
    key: string;
    adapter: string;
    name: string;
    projectId: string;
    status: AdapterConnectionStatus;

    public static parse(rawAdapterConnection: any): AdapterConnection {
        const adapterConnection: AdapterConnection = new AdapterConnection();
        adapterConnection.id = rawAdapterConnection.id;
        adapterConnection.key = rawAdapterConnection.key;
        adapterConnection.adapter = rawAdapterConnection.adapter;
        adapterConnection.name = rawAdapterConnection.name;
        adapterConnection.projectId = rawAdapterConnection.project;

        adapterConnection.status = AdapterConnectionStatus.fromString(rawAdapterConnection.status);
        return adapterConnection;
    }
}
