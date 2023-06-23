export class SourcesAccountRepositoryBranch {
    public key: string;

    public static parse(raw: any): SourcesAccountRepositoryBranch {
        const sourcesAccountRepositoryBranch: SourcesAccountRepositoryBranch = new SourcesAccountRepositoryBranch();
        sourcesAccountRepositoryBranch.key = raw.key;
        return sourcesAccountRepositoryBranch;
    }
}
