import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

/**
 * A named, reusable set of connections, scoped to one project.
 *
 * Note the wire names: the serializer strips a trailing `_id` and pluralises `_ids`, so the entity's
 * `projectId` arrives as `project` and `connectionIds` as `connections`.
 */
export class ConnectionBundle implements StateAware {
    public id: string;
    public name: string;
    public projectId: string;
    public connectionIds: string[] = [];
    public state: State = State.Active;
    public createdAt: Date;

    public static parse(raw: ApiRecord): ConnectionBundle {
        const bundle: ConnectionBundle = new ConnectionBundle();
        bundle.id = raw.id as string;
        bundle.name = raw.name as string;
        bundle.projectId = raw.project as string;
        bundle.connectionIds = Array.isArray(raw.connections) ? raw.connections as string[] : [];
        bundle.state = State.fromString(raw.state as string);
        bundle.createdAt = Utils.parseRawDate(raw.created_at as Date);
        return bundle;
    }
}
