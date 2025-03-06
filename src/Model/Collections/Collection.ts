import {ApiRecord} from '../ApiRecord.js';

export class Collection {
    id: string;
    project: string;
    name: string;
    properties: {
        id: string;
        name: string;
        // Type: text,select, mutli_select,url
        type: string;
        options: string[];
    }[];

    // records: CollectionRecord[];

    public static parse(raw: ApiRecord): Collection {
        const collection: Collection = new Collection();
        collection.id = raw.id as string;
        collection.project = raw.project as string;
        collection.name = raw.name as string;
        collection.properties = raw.properties as any;

        return collection;
    }
}
