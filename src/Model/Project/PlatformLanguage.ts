import {State} from '../State';
import {StateAware} from '../StateAware';

export class PlatformLanguage implements StateAware {
    public id: number;
    public name: string;
    public description: string = '';
    public state: State = State.Active;

    public constructor(id: number, name: string) {
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
