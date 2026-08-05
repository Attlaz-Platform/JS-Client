import {path} from '../Http/Data/Path.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {RunnerPoolCreate} from '../Model/Infrastructure/RunnerPoolCreate.js';
import {RunnerPool} from '../Model/Infrastructure/RunnerPool.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Endpoint} from './Endpoint.js';

export class RunnerPoolEndpoint extends Endpoint {
    public async getByProjectEnvironment(projectEnvironmentId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<RunnerPool>> {
        const queryString: QueryString = new QueryString(path('/runner-pools/project-environments/:projectEnvironmentId', {projectEnvironmentId}));
        queryString.addPagination(pagination);

        const result: CollectionResult<RunnerPool> = await this.requestCollection<RunnerPool>(queryString, RunnerPool.parse);
        return result;

    }

    public async create(projectEnvironmentId: string, pool: RunnerPoolCreate): Promise<RunnerPool | null> {
        const queryString: QueryString = new QueryString(path('/runner-pools/project-environments/:projectEnvironmentId', {projectEnvironmentId}));

        const body = {
            name: pool.name,
        };

        const result: ObjectResult<RunnerPool> = await this.requestObject(queryString, body, RunnerPool.parse, 'POST');
        return result.getData();

    }

    public async getById(queueSpecificationId: string): Promise<RunnerPool | null> {
        const queryString: QueryString = new QueryString(path('/runner-pools/:queueSpecificationId', {queueSpecificationId}));

        const result: ObjectResult<RunnerPool> = await this.requestObject(queryString, null, RunnerPool.parse);
        return result.getData();

    }

    public async redeploy(runnerPoolId: string): Promise<void> {
        const queryString: QueryString = new QueryString(path('/runner-pools/:runnerPoolId/redeploy', {runnerPoolId}));
        await this.requestObject(queryString, null, (raw: Record<string, any>) => raw, 'POST');
    }
}

