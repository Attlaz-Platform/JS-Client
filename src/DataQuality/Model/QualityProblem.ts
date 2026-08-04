import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One quality issue found on an entity — the
 * `/data-quality/datasets/:datasetId/entities/:entityType/:entityId/problems` resource.
 *
 * `code` says what is wrong (the rule that fired) and `property` where; `channel` and `locale`
 * narrow it to one sales channel or language when the rule is scoped that way.
 */
export class QualityProblem {
    public id: string;
    public entityType: string;
    public entityId: string;
    public code: string;
    public property: string = '';
    public severity: string = '';
    public note: string | null = null;
    public data: Record<string, unknown> | null = null;
    public channel: string | null = null;
    public locale: string | null = null;
    public status: string = '';
    public firstSeen: Date | null = null;
    public lastSeen: Date | null = null;

    public constructor(id: string, entityType: string, entityId: string, code: string) {
        this.id = id;
        this.entityType = entityType;
        this.entityId = entityId;
        this.code = code;
    }

    public static parse(raw: ApiRecord): QualityProblem {
        const problem: QualityProblem = new QualityProblem(
            raw.id as string,
            raw.entity_type as string,
            // The API strips the `_id` suffix, so `entity_id` arrives as `entity`.
            raw.entity as string,
            raw.code as string,
        );
        problem.property = (raw.property as string | undefined) ?? '';
        problem.severity = (raw.severity as string | undefined) ?? '';
        problem.note = (raw.note as string | undefined) ?? null;
        problem.data = (raw.data as Record<string, unknown> | undefined) ?? null;
        problem.channel = (raw.channel as string | undefined) ?? null;
        problem.locale = (raw.locale as string | undefined) ?? null;
        problem.status = (raw.status as string | undefined) ?? '';
        problem.firstSeen = raw.first_seen ? new Date(raw.first_seen as string) : null;
        problem.lastSeen = raw.last_seen ? new Date(raw.last_seen as string) : null;

        return problem;
    }
}
