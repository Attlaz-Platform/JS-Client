import {DataValueCollection} from '../Model/DataValueCollection.js';
import {ApiRecord} from '../Model/ApiRecord.js';
import {Utils} from '../Utils.js';
import {DataValueValue} from '../Model/DataValue.js';

export abstract class MetaDataAware {
    abstract id: string;

    public name: string;
    public description: string | null = null;
    public icon: string | null = null;

    public metadata: DataValueCollection;

    public updatedAt: Date | null = null;
    public createdAt: Date | null = null;

    public static parseMetaData<T extends MetaDataAware>(input: T, raw: ApiRecord): T {
        input.id = raw.id as string;
        input.name = raw.name as string;
        input.description = raw.description as string | null;
        input.icon = raw.icon as string | null;

        // TODO: parse meta data
        if (Object.prototype.hasOwnProperty.call(raw, 'metadata')) {
            // input.metadata = DataValueCollection.fromObject(raw.metadata as any);
            input.metadata = DataValueCollection.fromObject(raw.metadata as {
                key: string, value: DataValueValue
            }[] | null);
        } else {
            input.metadata = new DataValueCollection();
        }
        input.updatedAt = (raw.updated === null || raw.updated === undefined) ? null : Utils.parseRawDate(raw.updated as Date);
        input.createdAt = (raw.created === null || raw.created === undefined) ? null : Utils.parseRawDate(raw.created as Date);

        return input;
    }
}
