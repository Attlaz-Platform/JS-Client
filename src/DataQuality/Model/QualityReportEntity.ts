import {QualityReportProblem} from './QualityReportProblem.js';

/**
 * One entity being reported on: its identity, optionally what it is, and what was found.
 *
 * `entityType` + `entityId` are the natural key within the dataset — an entity is created on first
 * report, so there is nothing to register up front. `name`, `url` and `imageUrl` are optional: send
 * them and the dashboard can show a recognisable row instead of a bare identifier.
 *
 * `passed` carries codes that were *checked and found clean*. That is what lets the platform close
 * a problem that is no longer there — an entity reported with no problems and no `passed` codes says
 * nothing about the codes it was previously failing.
 */
export class QualityReportEntity {
    public entityType: string;
    public entityId: string;
    public name: string | null = null;
    public url: string | null = null;
    public imageUrl: string | null = null;
    public data: Record<string, unknown> | null = null;
    public problems: QualityReportProblem[] = [];
    public passed: string[] = [];

    public constructor(entityType: string, entityId: string) {
        this.entityType = entityType;
        this.entityId = entityId;
    }

    /**
     * The snake_case wire shape.
     *
     * Built explicitly, and sent with `_formatted: true`, because the client's key formatter
     * snake_cases keys *and strips a trailing `_id`* — it would turn `entity_id` into `entity`, which
     * the report endpoint rejects. See Endpoint.prepareParameters().
     */
    public toPayload(): Record<string, unknown> {
        return {
            entity_type: this.entityType,
            entity_id: this.entityId,
            name: this.name,
            url: this.url,
            image_url: this.imageUrl,
            data: this.data,
            problems: this.problems.map((problem: QualityReportProblem): Record<string, unknown> => problem.toPayload()),
            passed: this.passed,
        };
    }
}
