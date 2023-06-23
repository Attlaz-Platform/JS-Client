import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {Utils} from '../../Utils.js';

export class Platform implements StateAware {
    public id: string;
    public name: string;
    public languageId: string;
    public released: Date;
    public endOfSupport: Date;
    public endOfLife: Date;
    public state: State = State.Active;

    public static parse(raw: any): Platform {
        const platform: Platform = new Platform();
        platform.id = raw.id;
        platform.name = raw.name;
        platform.languageId = raw.language;
        platform.released = Utils.parseRawDate(raw.released);
        platform.endOfSupport = Utils.parseRawDate(raw.end_of_support)
        platform.endOfLife = Utils.parseRawDate(raw.end_of_life)
        platform.state = State.fromString(raw.state);

        return platform;
    }

}
