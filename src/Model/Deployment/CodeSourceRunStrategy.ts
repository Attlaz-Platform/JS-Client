import {StateAware} from '../StateAware.js';
import {State} from '../State.js';

export class CodeSourceRunStrategy implements StateAware {
    public id: string;
    public name: string;
    public description: string;
    public languageId: string;
    public state: State = State.Active;

    public static parse(raw: any): CodeSourceRunStrategy {
        const runStrategy: CodeSourceRunStrategy = new CodeSourceRunStrategy();
        runStrategy.id = raw.id;
        runStrategy.name = raw.name;
        runStrategy.description = raw.description;
        runStrategy.languageId = raw.language;
        runStrategy.state = State.fromString(raw.state);
        return runStrategy;
    }
}
