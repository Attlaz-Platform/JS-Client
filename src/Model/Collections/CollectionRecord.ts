import {ApiRecord} from '../ApiRecord.js';

export class CollectionRecord {
    public id: string;
    public collection: string;
    public properties: Record<string, unknown>;

    public static parse(raw: ApiRecord): CollectionRecord {
        const record: CollectionRecord = new CollectionRecord();
        record.id = raw.id as string;
        record.collection = raw.collection as string;
        record.properties = raw.properties as any;

        return record;
    }
}
