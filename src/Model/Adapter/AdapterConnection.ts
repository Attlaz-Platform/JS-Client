import {Utils} from '../../Utils.js';
import {StateAware} from '../StateAware.js';
import {State} from '../State.js';
import {ApiRecord} from '../ApiRecord.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {AdapterConnectionStatus} from './AdapterConnectionStatus.js';

export class AdapterConnection extends MetaDataAware implements StateAware {
    public id: string;
    public key: string;
    public adapter: string;
    public projectId: string;
    public status: AdapterConnectionStatus;
    public state: State = State.Active;
    public lastUsedAt: Date | null = null;

    public static parse(rawAdapterConnection: ApiRecord): AdapterConnection {
        const adapterConnection: AdapterConnection = MetaDataAware.parseMetaData(new AdapterConnection(), rawAdapterConnection);
        adapterConnection.id = rawAdapterConnection.id as string;
        adapterConnection.key = rawAdapterConnection.key as string;
        adapterConnection.adapter = rawAdapterConnection.adapter as string;
        adapterConnection.projectId = rawAdapterConnection.project as string;
        adapterConnection.state = State.fromString(rawAdapterConnection.state as string);
        adapterConnection.status = AdapterConnectionStatus.fromString(rawAdapterConnection.status as string);
        adapterConnection.lastUsedAt = rawAdapterConnection.last_used === null ? null : Utils.parseRawDate(rawAdapterConnection.last_used as Date);
        return adapterConnection;
    }
}
