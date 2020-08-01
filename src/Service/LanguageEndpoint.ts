import {Endpoint} from "..";
import {Language} from '../Model/Project/Language';

export class LanguageEndpoint extends Endpoint {

    public async getAll(): Promise<Language[]> {

        const languages: Language[] = [];
        languages.push(new Language(1, 'PHP'));
        languages.push(new Language(2, 'Node'));
        languages.push(new Language(3, 'Python'));
        return languages;

    }

}
