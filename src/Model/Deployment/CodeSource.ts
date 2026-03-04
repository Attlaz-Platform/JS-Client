import {MetaDataWithIconAware} from '../../Core/MetaDataWithIconAware.js';
import {ApiRecord} from '../ApiRecord.js';
import {State} from '../State.js';
import {StateAware} from '../StateAware.js';

export class CodeSource extends MetaDataWithIconAware implements StateAware {
    public id: string;
    public codeSourceAccountId: string;
    public repository: { key: string; name: string; url: string };
    public branch: string;
    public platformId: string;
    public buildStrategyId: string;
    public runStrategyId: string;
    public state: State = State.Active;
    public usage: { flows: number; environments: number } | null = null;
    public deployCount: number | null = null;

    public static parse(rawCodeSource: ApiRecord): CodeSource {
        const codeSource: CodeSource = MetaDataWithIconAware.parseMetaData(new CodeSource(), rawCodeSource);
        codeSource.id = rawCodeSource.id as string;
        codeSource.codeSourceAccountId = rawCodeSource.code_source_account as string;
        codeSource.repository = rawCodeSource.repository as unknown as { key: string; name: string; url: string };
        codeSource.branch = rawCodeSource.branch as string;
        codeSource.platformId = rawCodeSource.platform as string;
        codeSource.buildStrategyId = rawCodeSource.build_strategy as string;
        codeSource.runStrategyId = rawCodeSource.run_strategy as string;
        codeSource.state = State.fromString(rawCodeSource.state as string);
        if (Object.prototype.hasOwnProperty.call(rawCodeSource, 'usage')) {
            codeSource.usage = rawCodeSource.usage as unknown as { flows: number; environments: number } | null;
        }
        if (Object.prototype.hasOwnProperty.call(rawCodeSource, 'deploys')) {
            codeSource.deployCount = rawCodeSource.deploys as number | null;
        }

        return codeSource;
    }
}
