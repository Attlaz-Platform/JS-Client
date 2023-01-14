import {Endpoint} from './Endpoint';

import {SourcesAccountRepository} from '../Model/SourcesAccountRepository';
import {Utils} from '../Utils';
import {CodeSourceAccount} from '../Model/Deployment/CodeSourceAccount';
import {CodeSource} from '../Model/Deployment/CodeSource';
import {HttpClient} from '../Http/HttpClient';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class SourcesAccountEndpoint extends Endpoint {

    public async getAllCodeSourceAccounts(): Promise<CollectionResult<CodeSourceAccount>> {

        const result: CollectionResult<CodeSourceAccount> = await this.requestCollection('codesourceaccounts', null, CodeSourceAccount.parse);

        return result;

    }

    public async getCodeSourceAccountById(id: string): Promise<CodeSourceAccount | null> {
        try {
            const rawSourcesAccounts: ObjectResult<CodeSourceAccount> = await this.requestObject('codesourceaccounts/' + id, null, CodeSourceAccount.parse);

            return rawSourcesAccounts.getData();
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

            const result: ObjectResult<CodeSource> = await this.requestObject('/codesources/' + codeSourceId, null, CodeSource.parse);
            return result.getData();
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

    public async getRepositories(codeSourceAccountId: string): Promise<CollectionResult<SourcesAccountRepository>> {
        const rawSourcesAccountRepositories: CollectionResult<SourcesAccountRepository> = await this.requestCollection('codesourceaccounts/' + codeSourceAccountId + '/repositories', null, SourcesAccountRepository.parse);
        return rawSourcesAccountRepositories;
    }

    public async getRepositoryBranches(codeSourceAccountId: string, repositoryKey: string): Promise<CollectionResult<string>> {

        repositoryKey = Utils.base64encode(repositoryKey);
        const parser = (raw: any): string => {
            return raw;
        }
        const rawBranches: CollectionResult<string> = await this.requestCollection('sourcesaccounts/' + codeSourceAccountId + '/repositories/' + repositoryKey + '/branches', null, parser);

        return rawBranches;
    }

}
