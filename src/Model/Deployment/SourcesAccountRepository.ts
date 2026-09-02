import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class SourcesAccountRepository {
    public key: string;
    public name: string;
    public url: string;
    public description: string;

    /** Last push/commit, as the code host reports it. Null where the host gives none. */
    public lastActivityAt: Date | null = null;

    /** The code host's default branch. */
    public defaultBranch: string | null = null;

    public static parse(rawSourcesAccountRepository: ApiRecord): SourcesAccountRepository {
        const sourcesAccountRepository: SourcesAccountRepository = new SourcesAccountRepository();
        sourcesAccountRepository.key = rawSourcesAccountRepository.key as string;
        sourcesAccountRepository.name = rawSourcesAccountRepository.name as string;
        sourcesAccountRepository.url = rawSourcesAccountRepository.url as string;
        sourcesAccountRepository.description = rawSourcesAccountRepository.description as string;
        sourcesAccountRepository.lastActivityAt = (rawSourcesAccountRepository.last_activity_at === null || rawSourcesAccountRepository.last_activity_at === undefined) ? null : Utils.parseRawDate(rawSourcesAccountRepository.last_activity_at as Date);
        sourcesAccountRepository.defaultBranch = (rawSourcesAccountRepository.default_branch as string | null) ?? null;

        return sourcesAccountRepository;
    }
}
