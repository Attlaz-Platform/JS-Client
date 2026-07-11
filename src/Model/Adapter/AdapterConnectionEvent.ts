import {DataValueCollection} from '../DataValueCollection.js';
import {DataValueValue} from '../DataValue.js';
import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class AdapterConnectionEvent {
    public id: string;
    public adapterConnection: string;
    public type: string;
    public time: Date;
    public data: DataValueCollection;

    public static parse(rawAdapterConnection: ApiRecord): AdapterConnectionEvent {
        const adapterConnectionEvent: AdapterConnectionEvent = new AdapterConnectionEvent();
        adapterConnectionEvent.id = rawAdapterConnection.id as string;
        adapterConnectionEvent.adapterConnection = rawAdapterConnection.adapter_connection as string
        adapterConnectionEvent.type = rawAdapterConnection.type as string;
        adapterConnectionEvent.time = Utils.parseRawDate(rawAdapterConnection.time as Date);
        adapterConnectionEvent.data = DataValueCollection.fromObject(rawAdapterConnection.data as { key: string, value: DataValueValue }[] | null);

        return adapterConnectionEvent;
    }
}
