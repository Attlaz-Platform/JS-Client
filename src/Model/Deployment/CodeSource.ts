import {StateAware} from '../StateAware.js';
import {State} from '../State.js';

export class CodeSource implements StateAware {
    public id: string;
    public codeSourceAccountId: string;
    public repository: string;
    public branch: string;
    public platformId: string;
    public buildStrategyId: string;
    public runStrategyId: string;
    public description: string;
    public state: State = State.Active;

    public static parse(rawCodeSource: any): CodeSource {
        let codeSource: CodeSource = new CodeSource();
        codeSource.id = rawCodeSource.id;
        codeSource.codeSourceAccountId = rawCodeSource.code_source_account;
        codeSource.repository = rawCodeSource.repository;
        codeSource.branch = rawCodeSource.branch;
        codeSource.platformId = rawCodeSource.platform;
        codeSource.buildStrategyId = rawCodeSource.build_strategy;
        codeSource.runStrategyId = rawCodeSource.run_strategy;
        codeSource.description = rawCodeSource.description;
        codeSource.state = State.fromString(rawCodeSource.state);
        return codeSource;

    }
}
