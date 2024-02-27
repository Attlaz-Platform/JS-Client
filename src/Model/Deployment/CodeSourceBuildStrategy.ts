import {StateAware} from '../StateAware.js';
import {State} from '../State.js';

export class CodeSourceBuildStrategy implements StateAware {
    public id: string;
    public name: string;
    public description: string;
    public languageId: string;
    public state: State = State.Active;

    public static parse(raw: any): CodeSourceBuildStrategy {
        const codeDeployStrategy: CodeSourceBuildStrategy = new CodeSourceBuildStrategy();
        codeDeployStrategy.id = raw.id;
        codeDeployStrategy.name = raw.name;
        codeDeployStrategy.description = raw.description;
        codeDeployStrategy.languageId = raw.language;
        codeDeployStrategy.state = State.fromString(raw.state);
        return codeDeployStrategy;
    }
}
