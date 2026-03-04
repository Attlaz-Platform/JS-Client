import {QueryString} from '../Http/Data/QueryString.js';
import {RunnerPool} from '../Model/Infrastructure/RunnerPool.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class RunnerPoolEndpoint extends Endpoint {
    public async getByProjectEnvironment(projectEnvironmentId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<RunnerPool>> {
        const queryString: QueryString = new QueryString('/runner-pools/project-environments/' + projectEnvironmentId + '');
        queryString.addPagination(pagination);

        const result: CollectionResult<RunnerPool> = await this.requestCollection<RunnerPool>(queryString, RunnerPool.parse);
        return result;

    }

    public async getById(queueSpecificationId: string): Promise<RunnerPool | null> {
        const queryString: QueryString = new QueryString('/runner-pools/' + queueSpecificationId);

        const result: ObjectResult<RunnerPool> = await this.requestObject(queryString, null, RunnerPool.parse);
        return result.getData();

    }
}
