import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One transition of a single problem — the
 * `/data_quality/datasets/:datasetId/entities/:entityType/:entityId/problems/:code/events` resource.
 *
 * A problem is reported once and then re-reported by every later scan; only the transitions are
 * recorded, so the timeline stays short: `reported` when it first appears, `resolved` when a scan
 * proves it fixed, `regressed` when a resolved problem comes back. A suppressed problem produces no
 * events at all, so a muted code cannot bury the entries that matter.
 */
export class QualityProblemEvent {
    public id: string;
    public entityType: string;
    public entityId: string;
    public code: string;
    /** `reported` | `resolved` | `regressed` */
    public event: string;
    /** The scan that produced the transition, when one is recorded. */
    public scan: string | null = null;
    public at: Date | null = null;

    public constructor(id: string, code: string, event: string) {
        this.id = id;
        this.code = code;
        this.event = event;
    }

    public static parse(raw: ApiRecord): QualityProblemEvent {
        const event: QualityProblemEvent = new QualityProblemEvent(
            raw.id as string,
            raw.code as string,
            raw.event as string,
        );
        event.entityType = (raw.entity_type as string | undefined) ?? '';
        // The API strips the `_id` suffix, so `entity_id` arrives as `entity`.
        event.entityId = (raw.entity as string | undefined) ?? '';
        event.scan = (raw.scan as string | undefined) ?? null;
        event.at = raw.at ? new Date(raw.at as string) : null;

        return event;
    }
}
