import {State} from '../State';

export class Language {
    public id: number;
    public name: string;
    public description: string;
    public state: State = State.Active;

    public constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public static parse(rawLanguage: any): Language {
        let language: Language = new Language(rawLanguage.id, rawLanguage.name);
        language.description = rawLanguage.description;
        language.state = State.fromString(rawLanguage.state);
        return language;
    }
}
