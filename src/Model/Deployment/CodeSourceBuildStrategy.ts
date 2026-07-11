import {ApiRecord} from '../ApiRecord.js';
import {DataValueValue} from '../DataValue.js';
import {DataValueCollection} from '../DataValueCollection.js';
import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class CodeSourceBuildStrategy implements StateAware {
    public id: string;
    public name: string;
    public description: string;
    public languageId: string;
    public state: State = State.Active;
    // The strategy's parameter bag. Today it holds `command` (the shell command run inside the
    // platform build image). Kept as the whole bag so new keys need no model change. Read with
    // `data.get('command')`. Mirrors CodeSourceRunStrategy.
    public data: DataValueCollection = new DataValueCollection();

    public static parse(raw: ApiRecord): CodeSourceBuildStrategy {
        const codeDeployStrategy: CodeSourceBuildStrategy = new CodeSourceBuildStrategy();
        codeDeployStrategy.id = raw.id as string;
        codeDeployStrategy.name = raw.name as string;
        codeDeployStrategy.description = raw.description as string;
        codeDeployStrategy.languageId = raw.language as string;
        codeDeployStrategy.state = State.fromString(raw.state as string);
        codeDeployStrategy.data = DataValueCollection.fromObject(raw.data as { key: string, value: DataValueValue }[]);
        return codeDeployStrategy;
    }
}
