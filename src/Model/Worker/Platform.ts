import {State} from '../State';
import {StateAware} from '../StateAware';
import {Utils} from '../../Utils';

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
        platform.languageId = raw.languageId;
        platform.released = Utils.parseRawDate(raw.released);
        platform.endOfSupport = Utils.parseRawDate(raw.endOfSupport)
        platform.endOfLife = Utils.parseRawDate(raw.endOfLife)
        platform.state = State.fromString(raw.state);

        return platform;
    }

}
