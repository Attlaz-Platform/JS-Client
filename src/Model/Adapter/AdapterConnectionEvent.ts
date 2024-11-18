import {DataValueCollection} from '../DataValueCollection.js';
import {Utils} from '../../Utils.js';

export class AdapterConnectionEvent {
    public id: string;
    public adapterConnection: string;
    public type: string;
    public time: Date;
    public data: DataValueCollection;

    public static parse(rawAdapterConnection: any): AdapterConnectionEvent {
        const adapterConnectionEvent: AdapterConnectionEvent = new AdapterConnectionEvent();
        adapterConnectionEvent.id = rawAdapterConnection.id;
        adapterConnectionEvent.adapterConnection = rawAdapterConnection.adapter_connection
        adapterConnectionEvent.type = rawAdapterConnection.type;
        adapterConnectionEvent.time = Utils.parseRawDate(rawAdapterConnection.time);
        adapterConnectionEvent.data = DataValueCollection.fromObject(rawAdapterConnection.data);

        return adapterConnectionEvent;
    }
}
