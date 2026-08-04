import {QueryString} from '../../Http/Data/QueryString.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';
import {GenerateContentBatch} from '../Model/GenerateContentBatch.js';

/** What to generate, for which resources, using which strategy. */
export type GenerateContentBatchData = {
    name: string;
    strategy: string;
    resourcePool: string;
    resources: string[];
    properties: string[];
};

/**
 * Data Enrichment content generation — `/projects/:projectId/content-generation-batches`.
 *
 * Only batches are exposed by the API today; strategies, languages and the resulting proposals are
 * not yet endpoints, so they have no models here.
 */
export class GenerateContentEndpoint extends Endpoint {

    public async getBatches(projectId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<GenerateContentBatch>> {
        const queryString: QueryString = new QueryString('/projects/' + projectId + '/content-generation-batches');
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, GenerateContentBatch.parse);
    }

    /** Queue a batch. The generated values become proposals to review, not direct writes. */
    public async requestGeneration(projectId: string, data: GenerateContentBatchData): Promise<GenerateContentBatch | null> {
        const result: ObjectResult<GenerateContentBatch> = await this.requestObject(
            '/projects/' + projectId + '/content-generation-batches',
            data,
            GenerateContentBatch.parse,
            'POST',
        );

        return result.getData();
    }
}
