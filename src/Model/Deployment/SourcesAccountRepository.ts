export class SourcesAccountRepository {

    public key: string;
    public name: string;

    public static parse(rawSourcesAccountRepository: any): SourcesAccountRepository {
        let sourcesAccountRepository: SourcesAccountRepository = new SourcesAccountRepository();
        sourcesAccountRepository.key = rawSourcesAccountRepository.key;
        sourcesAccountRepository.name = rawSourcesAccountRepository.name;

        return sourcesAccountRepository;

    }
}
