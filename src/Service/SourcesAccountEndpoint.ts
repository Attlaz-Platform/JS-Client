import {Endpoint} from './Endpoint';

import {SourcesAccountRepository} from '../Model/SourcesAccountRepository';
import {Utils} from '../Utils';
import {CodeSourceAccount} from '../Model/Deployment/CodeSourceAccount';
import {CodeSource} from '../Model/Deployment/CodeSource';
import {HttpClient} from '../Http/HttpClient';

export class SourcesAccountEndpoint extends Endpoint {

    public async getAllCodeSourceAccounts(): Promise<CodeSourceAccount[]> {

        const rawSourcesAccounts: any[] = await this.httpClient.request('codesourceaccounts');

        let sourcesAccounts: CodeSourceAccount[] = [];
        for (let rawSourcesAccount of rawSourcesAccounts) {
            sourcesAccounts.push(CodeSourceAccount.parse(rawSourcesAccount));
        }
        return sourcesAccounts;

    }

    public async getCodeSourceAccountById(id: string): Promise<CodeSourceAccount | null> {
        try {
            const rawSourcesAccounts: any | null = await this.httpClient.request('codesourceaccounts/' + id);

            if (rawSourcesAccounts === null) {
                return null;
            }
            return CodeSourceAccount.parse(rawSourcesAccounts);
        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load code source account by id', error);
            }

            throw error;
        }
        // let sourcesAccounts: CodeSourceAccount[] = [];
        // for (let rawSourcesAccount of rawSourcesAccounts) {
        //     sourcesAccounts.push(CodeSourceAccount.parse(rawSourcesAccount));
        // }
        // return sourcesAccounts;

    }

    public async getCodeSourceById(codeSourceId: string): Promise<CodeSource | null> {

        try {
            const rawCodeSource: any | null = await this.httpClient.request('/codesources/' + codeSourceId);
            if (rawCodeSource === null) {
                return null;
            }
            return CodeSource.parse(rawCodeSource);
        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load code source by id', error);
            }

            throw error;
        }

    }

    public async getRepositories(codeSourceAccountId: string): Promise<SourcesAccountRepository[]> {
        const rawSourcesAccountRepositories: any[] = await this.httpClient.request('codesourceaccounts/' + codeSourceAccountId + '/repositories');

        let sourcesAccountRepositories: SourcesAccountRepository[] = [];
        for (let rawSourcesAccountRepository of rawSourcesAccountRepositories) {
            sourcesAccountRepositories.push(SourcesAccountRepository.parse(rawSourcesAccountRepository));
        }
        return sourcesAccountRepositories;
    }

    public async getRepositoryBranches(codeSourceAccountId: string, repositoryKey: string): Promise<string[]> {

        repositoryKey = Utils.base64encode(repositoryKey);
        const rawBranches: string[] = await this.httpClient.request('sourcesaccounts/' + codeSourceAccountId + '/repositories/' + repositoryKey + '/branches');

        return rawBranches;
    }

}
