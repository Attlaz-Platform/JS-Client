import {StateAware} from '../StateAware.js';
import {State} from '../State.js';

export class CodeSourceRunStrategy implements StateAware {
    public id: string;
    public name: string;
    public description: string;
    public state: State = State.Active;

    public static parse(raw: any): CodeSourceRunStrategy {
        const codeDeployStrategy: CodeSourceRunStrategy = new CodeSourceRunStrategy();
        codeDeployStrategy.id = raw.id;
        codeDeployStrategy.name = raw.name;
        codeDeployStrategy.description = raw.description;
        codeDeployStrategy.state = State.fromString(raw.state);
        return codeDeployStrategy;
    }
}
