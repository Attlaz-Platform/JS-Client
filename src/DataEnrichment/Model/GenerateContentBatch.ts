import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One request to generate content for a set of resources — the
 * `/projects/:projectId/content-generation-batches` resource.
 *
 * `resourcePool` is what the resources are drawn from (today always a catalog), `resources` the
 * entities to generate for, and `properties` which fields of them to write (name, description, …).
 * The generated values land as proposals for review rather than being applied directly.
 */
export class GenerateContentBatch {
    public id: string;
    public name: string;
    public projectId: string;
    public strategyId: string = '';
    public resourcePoolId: string = '';
    public resourceIds: string[] = [];
    public properties: string[] = [];
    public createdAt: Date | null = null;
    public updatedAt: Date | null = null;

    public constructor(id: string, name: string, projectId: string) {
        this.id = id;
        this.name = name;
        this.projectId = projectId;
    }

    public static parse(raw: ApiRecord): GenerateContentBatch {
        const batch: GenerateContentBatch = new GenerateContentBatch(
            raw.id as string,
            (raw.name as string | undefined) ?? '',
            raw.project as string,
        );
        batch.strategyId = (raw.strategy as string | undefined) ?? '';
        batch.resourcePoolId = (raw.resource_pool as string | undefined) ?? '';
        batch.resourceIds = (raw.resources as string[] | undefined) ?? [];
        batch.properties = (raw.properties as string[] | undefined) ?? [];
        batch.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        batch.updatedAt = raw.updated_at ? new Date(raw.updated_at as string) : null;

        return batch;
    }
}
