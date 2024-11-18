import {Utils} from '../../Utils.js';
import {AdapterConnectionStatus} from './AdapterConnectionStatus.js';

export class AdapterConnection {
    id: string;
    key: string;
    adapter: string;
    name: string;
    projectId: string;
    status: AdapterConnectionStatus;
    lastUsed: Date | null = null;

    public static parse(rawAdapterConnection: any): AdapterConnection {
        const adapterConnection: AdapterConnection = new AdapterConnection();
        adapterConnection.id = rawAdapterConnection.id;
        adapterConnection.key = rawAdapterConnection.key;
        adapterConnection.adapter = rawAdapterConnection.adapter;
        adapterConnection.name = rawAdapterConnection.name;
        adapterConnection.projectId = rawAdapterConnection.project;

        adapterConnection.status = AdapterConnectionStatus.fromString(rawAdapterConnection.status);
        adapterConnection.lastUsed = rawAdapterConnection.last_used === null ? null : Utils.parseRawDate(rawAdapterConnection.last_used);
        return adapterConnection;
    }
}
