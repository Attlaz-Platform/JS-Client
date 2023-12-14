import {Endpoint} from './Endpoint.js';
import {Utils} from '../Utils.js';
import {CodeSourceAccount} from '../Model/Deployment/CodeSourceAccount.js';
import {CodeSource} from '../Model/Deployment/CodeSource.js';
import {HttpClient} from '../Http/HttpClient.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {SourcesAccountRepository} from '../Model/Deployment/SourcesAccountRepository.js';
import {SourcesAccountRepositoryBranch} from '../Model/Deployment/SourcesAccountRepositoryBranch.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';

export class SourcesAccountEndpoint extends Endpoint {
    public async getAllCodeSources(workspaceId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<CodeSource>> {
        const queryString: QueryString = new QueryString('workspaces/' + workspaceId + '/codesources');
        queryString.addPagination(pagination);
        const result: CollectionResult<CodeSource> = await this.requestCollection(queryString, CodeSource.parse);
        return result;
    }

    public async getAllCodeSourceAccounts(workspaceId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<CodeSourceAccount>> {
        const queryString: QueryString = new QueryString('workspaces/' + workspaceId + '/codesourceaccounts');
        queryString.addPagination(pagination);
        const result: CollectionResult<CodeSourceAccount> = await this.requestCollection(queryString, CodeSourceAccount.parse);

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

    public async getRepositories(codeSourceAccountId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<SourcesAccountRepository>> {
        const queryString: QueryString = new QueryString('codesourceaccounts/' + codeSourceAccountId + '/repositories');
        queryString.addPagination(pagination);
        const rawSourcesAccountRepositories: CollectionResult<SourcesAccountRepository> = await this.requestCollection(queryString, SourcesAccountRepository.parse);
        return rawSourcesAccountRepositories;
    }

    public async getRepositoryBranches(codeSourceAccountId: string, repositoryKey: string, pagination: CursorPagination | null = null): Promise<CollectionResult<SourcesAccountRepositoryBranch>> {
        const queryString: QueryString = new QueryString('codesourceaccounts/' + codeSourceAccountId + '/repositories/' + repositoryKey + '/branches');
        queryString.addPagination(pagination);
        repositoryKey = Utils.base64encode(repositoryKey);
        const rawBranches: CollectionResult<SourcesAccountRepositoryBranch> = await this.requestCollection(queryString, SourcesAccountRepositoryBranch.parse);
        return rawBranches;
    }

    public async saveCodeSource(codeSource: CodeSource): Promise<CodeSource> {
        try {
            const url: string = '/codesources/';

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
