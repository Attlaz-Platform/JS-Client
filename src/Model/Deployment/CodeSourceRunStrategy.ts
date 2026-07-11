import {ApiRecord} from '../ApiRecord.js';
import {DataValueValue} from '../DataValue.js';
import {DataValueCollection} from '../DataValueCollection.js';
import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class CodeSourceRunStrategy implements StateAware {
    public id: string;
    public name: string;
    public description: string;
    public languageId: string;
    public state: State = State.Active;
    // The strategy's parameter bag. Today it holds `command`; a future non-shell strategy might hold
    // `endpoint`/`port`/etc. Kept as the whole bag so new keys need no model change. Read with
    // `data.get('command')`.
    public data: DataValueCollection = new DataValueCollection();

    public static parse(raw: ApiRecord): CodeSourceRunStrategy {
        const runStrategy: CodeSourceRunStrategy = new CodeSourceRunStrategy();
        runStrategy.id = raw.id as string;
        runStrategy.name = raw.name as string;
        runStrategy.description = raw.description as string;
        runStrategy.languageId = raw.language as string;
        runStrategy.state = State.fromString(raw.state as string);
        runStrategy.data = DataValueCollection.fromObject(raw.data as { key: string, value: DataValueValue }[]);
        return runStrategy;
    }
}
