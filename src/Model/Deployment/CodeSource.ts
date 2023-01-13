export class CodeSource {
    public id: string;
    public codeSourceAccountId: string;
    public repository: string;
    public branch: string;
    public platformId: string;
    public buildStrategyId: string;

    public static parse(rawCodeSource: any): CodeSource {
        let codeSource: CodeSource = new CodeSource();
        codeSource.id = rawCodeSource.id;
        codeSource.codeSourceAccountId = rawCodeSource.codeSourceAccountId;
        codeSource.repository = rawCodeSource.repository;
        codeSource.branch = rawCodeSource.branch;
        codeSource.platformId = rawCodeSource.platformId;
        codeSource.buildStrategyId = rawCodeSource.buildStrategyId;
        return codeSource;

    }
}
