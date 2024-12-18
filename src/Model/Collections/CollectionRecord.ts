export class CollectionRecord {
    public id: string;
    public collection: string;
    public properties: Record<string, unknown>;

    public static parse(raw: Record<string, unknown>): CollectionRecord {
        const record: CollectionRecord = new CollectionRecord();
        record.id = raw.id as string;
        record.collection = raw.collection as string;
        record.properties = raw.properties as any;

        return record;
    }
}
