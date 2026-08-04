import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One thing being checked in a dataset (a product, a category, …), with a rollup of the problems
 * currently open on it — the `/data-quality/datasets/:datasetId/entities` resource.
 *
 * `entityType` + `entityId` identify it in the source system; `id` is the dataset's own row.
 */
export class QualityEntity {
    public id: string;
    public entityType: string;
    public entityId: string;
    public name: string | null = null;
    public url: string | null = null;
    public imageUrl: string | null = null;
    public status: string = '';
    /** Identifier of the scan that last reported on this entity. */
    public lastScan: string | null = null;
    public firstSeen: Date | null = null;
    public lastSeen: Date | null = null;
    public problemCount: number = 0;
    public worstSeverity: string | null = null;

    public constructor(id: string, entityType: string, entityId: string) {
        this.id = id;
        this.entityType = entityType;
        this.entityId = entityId;
    }

    public static parse(raw: ApiRecord): QualityEntity {
        const entity: QualityEntity = new QualityEntity(
            raw.id as string,
            raw.entity_type as string,
            // The API strips the `_id` suffix, so `entity_id` arrives as `entity`.
            raw.entity as string,
        );
        entity.name = (raw.name as string | undefined) ?? null;
        entity.url = (raw.url as string | undefined) ?? null;
        entity.imageUrl = (raw.image_url as string | undefined) ?? null;
        entity.status = (raw.status as string | undefined) ?? '';
        entity.lastScan = (raw.last_scan as string | undefined) ?? null;
        entity.firstSeen = raw.first_seen ? new Date(raw.first_seen as string) : null;
        entity.lastSeen = raw.last_seen ? new Date(raw.last_seen as string) : null;
        entity.problemCount = Number(raw.problem_count ?? 0);
        entity.worstSeverity = (raw.worst_severity as string | undefined) ?? null;

        return entity;
    }
}
