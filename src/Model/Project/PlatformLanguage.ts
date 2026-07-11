import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class PlatformLanguage implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public description: string = '';
    public state: State = State.Active;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public static parse(rawLanguage: ApiRecord): PlatformLanguage {
        const language: PlatformLanguage = new PlatformLanguage(rawLanguage.id as string, rawLanguage.name as string);
        language.key = rawLanguage.key as string;
        language.description = rawLanguage.description as string;
        language.state = State.fromString(rawLanguage.state as string);
        return language;
    }
}
