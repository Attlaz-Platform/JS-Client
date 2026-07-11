import {ApiRecord} from '../ApiRecord.js';

export class SourcesAccountRepositoryBranch {
    public key: string;

    public static parse(raw: ApiRecord): SourcesAccountRepositoryBranch {
        const sourcesAccountRepositoryBranch: SourcesAccountRepositoryBranch = new SourcesAccountRepositoryBranch();
        sourcesAccountRepositoryBranch.key = raw.key as string;
        return sourcesAccountRepositoryBranch;
    }
}
