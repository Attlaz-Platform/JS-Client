import {ApiRecord} from '../Model/ApiRecord.js';
import {DataValueCollection} from '../Model/DataValueCollection.js';
import {MetaDataAware} from './MetaDataAware.js';

export abstract class MetaDataWithIconAware {
    abstract id: string;

    public icon: string | null;

    public name: string;
    public description: string | null = null;

    public metadata: DataValueCollection;

    public updatedAt: Date | null = null;
    public createdAt: Date | null = null;

    public static parseMetaData<T extends MetaDataWithIconAware>(input: T, raw: ApiRecord): T {
        input = MetaDataAware.parseMetaData(input, raw);
        input.icon = raw.icon as string | null;

        return input;
    }
}
