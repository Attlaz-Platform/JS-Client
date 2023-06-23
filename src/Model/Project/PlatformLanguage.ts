import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class PlatformLanguage implements StateAware {
    public id: string;
    public name: string;
    public description: string = '';
    public state: State = State.Active;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static parse(rawLanguage: any): PlatformLanguage {
        let language: PlatformLanguage = new PlatformLanguage(rawLanguage.id, rawLanguage.name);
        language.description = rawLanguage.description;
        language.state = State.fromString(rawLanguage.state);
        return language;
    }
}
