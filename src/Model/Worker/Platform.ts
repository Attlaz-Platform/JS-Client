import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class Platform implements StateAware {
    public id: string;
    public name: string;
    public languageId: string;
    public released: Date;
    public endOfSupport: Date;
    public endOfLife: Date;
    public activeImage: string | null;
    public state: State = State.Active;

    public static parse(raw: ApiRecord): Platform {
        const platform: Platform = new Platform();
        platform.id = raw.id as string;
        platform.name = raw.name as string;
        platform.languageId = raw.language as string;
        platform.released = Utils.parseRawDate(raw.released as Date);
        platform.endOfSupport = Utils.parseRawDate(raw.end_of_support as Date);
        platform.endOfLife = Utils.parseRawDate(raw.end_of_life as Date);
        platform.activeImage = raw.active_image as string | null;
        platform.state = State.fromString(raw.state as string);

        return platform;
    }
}
