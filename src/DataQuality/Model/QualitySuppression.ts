import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A standing decision to ignore a problem code — the
 * `/data_quality/datasets/:datasetId/suppressions` resource.
 *
 * With `entityType` and `entityId` set it covers that one entity; with both null it covers the code
 * across the whole dataset. Suppressed problems are still ingested but parked in `muted`, so they
 * stay out of the needs-attention list and out of every auto-close path without losing history.
 */
export class QualitySuppression {
    public id: string;
    public code: string;
    /** Both null = the suppression applies to this code across the whole dataset. */
    public entityType: string | null = null;
    public entityId: string | null = null;
    public reason: string | null = null;
    public createdBy: string | null = null;
    public createdAt: Date | null = null;

    public constructor(id: string, code: string) {
        this.id = id;
        this.code = code;
    }

    public get isDatasetWide(): boolean {
        return this.entityId === null;
    }

    public static parse(raw: ApiRecord): QualitySuppression {
        const suppression: QualitySuppression = new QualitySuppression(raw.id as string, raw.code as string);
        suppression.entityType = (raw.entity_type as string | undefined) ?? null;
        // The API strips the `_id` suffix, so `entity_id` arrives as `entity`.
        suppression.entityId = (raw.entity as string | undefined) ?? null;
        suppression.reason = (raw.reason as string | undefined) ?? null;
        suppression.createdBy = (raw.created_by as string | undefined) ?? null;
        suppression.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;

        return suppression;
    }
}
