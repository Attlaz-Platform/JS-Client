export class SourcesAccountRepositoryBranch {

    public key: string;

    public static parse(raw: any): SourcesAccountRepositoryBranch {
        let sourcesAccountRepositoryBranch: SourcesAccountRepositoryBranch = new SourcesAccountRepositoryBranch();
        sourcesAccountRepositoryBranch.key = raw.key;
        return sourcesAccountRepositoryBranch;

    }
}
