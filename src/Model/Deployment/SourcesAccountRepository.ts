import {ApiRecord} from '../ApiRecord.js';

export class SourcesAccountRepository {
    public key: string;
    public name: string;
    public url: string;
    public description: string;

    public static parse(rawSourcesAccountRepository: ApiRecord): SourcesAccountRepository {
        const sourcesAccountRepository: SourcesAccountRepository = new SourcesAccountRepository();
        sourcesAccountRepository.key = rawSourcesAccountRepository.key as string;
        sourcesAccountRepository.name = rawSourcesAccountRepository.name as string;
        sourcesAccountRepository.url = rawSourcesAccountRepository.url as string;
        sourcesAccountRepository.description = rawSourcesAccountRepository.description as string;

        return sourcesAccountRepository;
    }
}
