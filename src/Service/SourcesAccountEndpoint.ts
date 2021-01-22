import {Endpoint, SourcesAccount, SourcesAccountRepository} from '..';

export class SourcesAccountEndpoint extends Endpoint {

    public async getAll(): Promise<SourcesAccount[]> {

        const rawSourcesAccounts: any[] = await this.httpClient.request('sourcesaccounts');

        let sourcesAccounts: SourcesAccount[] = [];
        for (let rawSourcesAccount of rawSourcesAccounts) {
            sourcesAccounts.push(SourcesAccount.parse(rawSourcesAccount));
        }
        return sourcesAccounts;

    }

    public async getRepositories(sourcesAccountId: number): Promise<SourcesAccountRepository[]> {
        const rawSourcesAccountRepositories: any[] = await this.httpClient.request('sourcesaccounts/' + sourcesAccountId + '/repositories');

        let sourcesAccountRepositories: SourcesAccountRepository[] = [];
        for (let rawSourcesAccountRepository of rawSourcesAccountRepositories) {
            sourcesAccountRepositories.push(SourcesAccountRepository.parse(rawSourcesAccountRepository));
        }
        return sourcesAccountRepositories;
    }

    public async getRepositoryBranches(sourcesAccountId: number, repositoryKey: string): Promise<string[]> {

        repositoryKey = btoa(repositoryKey);
        const rawBranches: string[] = await this.httpClient.request('sourcesaccounts/' + sourcesAccountId + '/repositories/' + repositoryKey + '/branches');

        return rawBranches;
    }

}
