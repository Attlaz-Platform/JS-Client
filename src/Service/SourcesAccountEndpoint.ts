import {Endpoint} from './Endpoint.js';
import {Utils} from '../Utils.js';
import {CodeSourceAccount} from '../Model/Deployment/CodeSourceAccount.js';
import {CodeSource} from '../Model/Deployment/CodeSource.js';
import {HttpClient} from '../Http/HttpClient.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {SourcesAccountRepository} from '../Model/Deployment/SourcesAccountRepository.js';
import {SourcesAccountRepositoryBranch} from '../Model/Deployment/SourcesAccountRepositoryBranch.js';

export class SourcesAccountEndpoint extends Endpoint {
    public async getAllCodeSources(workspaceId: string): Promise<CollectionResult<CodeSource>> {
        const result: CollectionResult<CodeSource> = await this.requestCollection('workspaces/' + workspaceId + '/codesources', CodeSource.parse);
        return result;
    }

    public async getAllCodeSourceAccounts(workspaceId: string): Promise<CollectionResult<CodeSourceAccount>> {
        const result: CollectionResult<CodeSourceAccount> = await this.requestCollection('workspaces/' + workspaceId + '/codesourceaccounts', CodeSourceAccount.parse);
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
        const rawSourcesAccountRepositories: CollectionResult<SourcesAccountRepository> = await this.requestCollection('codesourceaccounts/' + codeSourceAccountId + '/repositories', SourcesAccountRepository.parse);
        return rawSourcesAccountRepositories;
    }

    public async getRepositoryBranches(codeSourceAccountId: string, repositoryKey: string): Promise<CollectionResult<SourcesAccountRepositoryBranch>> {
        repositoryKey = Utils.base64encode(repositoryKey);
        const rawBranches: CollectionResult<SourcesAccountRepositoryBranch> = await this.requestCollection('codesourceaccounts/' + codeSourceAccountId + '/repositories/' + repositoryKey + '/branches', SourcesAccountRepositoryBranch.parse);
        return rawBranches;
    }

    public async saveCodeSource(codeSource: CodeSource): Promise<CodeSource> {

        try {
            let url: string = '/codesources/';

            const result: ObjectResult<CodeSource> = await this.requestObject(url, codeSource, CodeSource.parse, 'POST');

            const updatedCodeSource: CodeSource | null = result.getData();
            if (updatedCodeSource === null) {
                throw new Error('Unable to update code source: wrong response from API');
            }
            return updatedCodeSource;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save code source: ', ex);
            }
            throw ex;
        }

    }

}
