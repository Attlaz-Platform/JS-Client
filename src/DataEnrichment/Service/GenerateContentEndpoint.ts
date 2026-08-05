import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {GenerateContentBatch} from '../Model/GenerateContentBatch.js';
import {GenerateContentBatchData} from '../Model/GenerateContentBatchData.js';

/**
 * Data Enrichment content generation — `/projects/:projectId/content-generation-batches`.
 *
 * Only batches are exposed by the API today; strategies, languages and the resulting proposals are
 * not yet endpoints, so they have no models here.
 */
export class GenerateContentEndpoint extends Endpoint {

    public async getBatches(projectId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<GenerateContentBatch>> {
        const queryString: QueryString = new QueryString(path('/projects/:projectId/content-generation-batches', {projectId}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, GenerateContentBatch.parse);
    }

    /** Queue a batch. The generated values become proposals to review, not direct writes. */
    public async requestGeneration(projectId: string, data: GenerateContentBatchData): Promise<GenerateContentBatch | null> {
        const result: ObjectResult<GenerateContentBatch> = await this.requestObject(
            path('/projects/:projectId/content-generation-batches', {projectId}),
            data,
            GenerateContentBatch.parse,
            'POST',
        );

        return result.getData();
    }
}
