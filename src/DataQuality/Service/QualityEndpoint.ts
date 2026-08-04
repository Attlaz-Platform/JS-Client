import {QueryString} from '../../Http/Data/QueryString.js';
import {ApiRecord} from '../../Model/ApiRecord.js';
import {QualityDataset} from '../Model/QualityDataset.js';
import {QualityEntity} from '../Model/QualityEntity.js';
import {QualityProblem} from '../Model/QualityProblem.js';
import {QualityProblemEvent} from '../Model/QualityProblemEvent.js';
import {QualitySuppression} from '../Model/QualitySuppression.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

/** Narrows the entity list; every field is optional and omitted filters are not sent. */
export type QualityEntityFilters = {
    entityType?: string | null;
    status?: string | null;
    severity?: string | null;
    property?: string | null;
    code?: string | null;
    /** Only entities carrying a problem first seen after this moment ("what appeared since…"). */
    newSince?: Date | null;
};

/** One row of the dataset summary: how many problems of a severity are open on a property. */
export type QualitySummaryRow = {
    property: string;
    severity: string;
    count: number;
};

/**
 * One row of the per-code summary, joined to the problem definition — the input for the
 * "what should I fix next" cards. Already ordered blocking first, then severity, then count.
 *
 * `blocking` and `severity` are orthogonal: severity is how bad the problem is, blocking is whether
 * the entity can ship at all.
 */
export type QualityCodeSummaryRow = {
    code: string;
    count: number;
    worstSeverity: string;
    label: string | null;
    description: string | null;
    blocking: boolean;
    helpUrl: string | null;
};

/** Both groupings returned by the summary endpoint. */
export type QualitySummary = {
    counts: QualitySummaryRow[];
    codes: QualityCodeSummaryRow[];
};

/** A code with its label and open count, so a filter control can show the label not the raw code. */
export type QualityCodeOption = {
    code: string;
    label: string | null;
    count: number;
};

/** The values the entity list can be filtered on, for the dataset as it currently stands. */
export type QualityFilterOptions = {
    entityTypes: string[];
    properties: string[];
    codes: QualityCodeOption[];
};

/** What a new suppression did: the record itself, plus how many open problems it muted. */
export type QualitySuppressionResult = {
    suppression: QualitySuppression | null;
    muted: number;
};

/**
 * Data Quality — `/data_quality/datasets`. A dataset holds the entities being checked and the
 * problems open on them.
 */
export class QualityEndpoint extends Endpoint {

    public async getDatasets(projectId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<QualityDataset>> {
        const queryString: QueryString = new QueryString('/data_quality/datasets');
        queryString.set('project', projectId);
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, QualityDataset.parse);
    }

    public async getDataset(datasetId: string): Promise<QualityDataset | null> {
        const result: ObjectResult<QualityDataset> = await this.requestObject(
            '/data_quality/datasets/' + datasetId,
            null,
            QualityDataset.parse,
            'GET',
        );

        return result.getData();
    }

    public async createDataset(projectId: string, name: string, autoCloseMode: string | null = null): Promise<QualityDataset | null> {
        const body: Record<string, string> = {project: projectId, name};
        if (autoCloseMode !== null) {
            body['auto_close_mode'] = autoCloseMode;
        }
        const result: ObjectResult<QualityDataset> = await this.requestObject(
            '/data_quality/datasets',
            body,
            QualityDataset.parse,
            'POST',
        );

        return result.getData();
    }

    public async updateDataset(datasetId: string, changes: {name?: string; autoCloseMode?: string}): Promise<QualityDataset | null> {
        // camelCase keys are snake_cased by the base Endpoint (autoCloseMode -> auto_close_mode).
        const result: ObjectResult<QualityDataset> = await this.requestObject(
            '/data_quality/datasets/' + datasetId,
            changes,
            QualityDataset.parse,
            'PATCH',
        );

        return result.getData();
    }

    public async deleteDataset(datasetId: string): Promise<void> {
        await this.requestObject(
            '/data_quality/datasets/' + datasetId,
            null,
            (raw: unknown): unknown => raw,
            'DELETE',
        );
    }

    public async getEntities(datasetId: string, pagination: CursorPagination | null = null, filters: QualityEntityFilters = {}): Promise<CollectionResult<QualityEntity>> {
        const queryString: QueryString = new QueryString('/data_quality/datasets/' + datasetId + '/entities');
        if (filters.entityType) {
            queryString.set('entity_type', filters.entityType);
        }
        if (filters.status) {
            queryString.set('status', filters.status);
        }
        if (filters.severity) {
            queryString.set('severity', filters.severity);
        }
        if (filters.property) {
            queryString.set('property', filters.property);
        }
        if (filters.code) {
            queryString.set('code', filters.code);
        }
        if (filters.newSince) {
            queryString.set('new_since', filters.newSince.toISOString());
        }
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, QualityEntity.parse);
    }

    /** Suppressed problems are hidden unless `includeSuppressed` is set. */
    public async getEntityProblems(datasetId: string, entityType: string, entityId: string, includeSuppressed: boolean = false): Promise<CollectionResult<QualityProblem>> {
        const queryString: QueryString = new QueryString('/data_quality/datasets/' + datasetId
            + '/entities/' + encodeURIComponent(entityType)
            + '/' + encodeURIComponent(entityId) + '/problems');
        if (includeSuppressed) {
            queryString.set('include_suppressed', 'true');
        }

        return await this.requestCollection(queryString, QualityProblem.parse);
    }

    /** The transition timeline for one problem, oldest first. */
    public async getProblemEvents(datasetId: string, entityType: string, entityId: string, code: string): Promise<CollectionResult<QualityProblemEvent>> {
        const path: string = '/data_quality/datasets/' + datasetId
            + '/entities/' + encodeURIComponent(entityType)
            + '/' + encodeURIComponent(entityId)
            + '/problems/' + encodeURIComponent(code) + '/events';

        return await this.requestCollection(path, QualityProblemEvent.parse);
    }

    /** Clear an entity's problems so the next scan starts from scratch; returns how many were removed. */
    public async resetEntity(datasetId: string, entityType: string, entityId: string): Promise<number> {
        const path: string = '/data_quality/datasets/' + datasetId
            + '/entities/' + encodeURIComponent(entityType)
            + '/' + encodeURIComponent(entityId) + '/reset';

        const result: ObjectResult<{deleted: number}> = await this.requestObject(
            path,
            {},
            (raw: Record<string, unknown>): {deleted: number} => ({deleted: (raw.deleted as number | undefined) ?? 0}),
            'POST',
        );

        return result.getData()?.deleted ?? 0;
    }

    public async getFilterOptions(datasetId: string): Promise<QualityFilterOptions> {
        const result: ObjectResult<QualityFilterOptions> = await this.requestObject(
            '/data_quality/datasets/' + datasetId + '/filter-options',
            null,
            (raw: Record<string, unknown>): QualityFilterOptions => ({
                entityTypes: (raw.entity_types as string[] | undefined) ?? [],
                properties: (raw.properties as string[] | undefined) ?? [],
                codes: ((raw.codes as Record<string, unknown>[] | undefined) ?? []).map(
                    (row: Record<string, unknown>): QualityCodeOption => ({
                        code: row.code as string,
                        label: (row.label as string | undefined) ?? null,
                        count: Number(row.count ?? 0),
                    })),
            }),
            'GET',
        );

        return result.getData() ?? {entityTypes: [], properties: [], codes: []};
    }

    /** Both groupings in one call: `counts` by (property, severity) and `codes` for the fix cards. */
    public async getSummary(datasetId: string): Promise<QualitySummary> {
        const result: ObjectResult<QualitySummary> = await this.requestObject(
            '/data_quality/datasets/' + datasetId + '/summary',
            null,
            (raw: Record<string, unknown>): QualitySummary => ({
                counts: ((raw.counts as Record<string, unknown>[] | undefined) ?? []).map(
                    (row: Record<string, unknown>): QualitySummaryRow => ({
                        property: row.property as string,
                        severity: row.severity as string,
                        count: Number(row.count),
                    })),
                codes: ((raw.codes as Record<string, unknown>[] | undefined) ?? []).map(
                    (row: Record<string, unknown>): QualityCodeSummaryRow => ({
                        code: row.code as string,
                        count: Number(row.count),
                        worstSeverity: row.worst_severity as string,
                        label: (row.label as string | undefined) ?? null,
                        description: (row.description as string | undefined) ?? null,
                        blocking: row.blocking === true,
                        helpUrl: (row.help_url as string | undefined) ?? null,
                    })),
            }),
            'GET',
        );

        return result.getData() ?? {counts: [], codes: []};
    }

    // ---- Suppressions ----

    public async getSuppressions(datasetId: string): Promise<CollectionResult<QualitySuppression>> {
        return await this.requestCollection(
            '/data_quality/datasets/' + datasetId + '/suppressions',
            QualitySuppression.parse,
        );
    }

    /**
     * Suppress a code, either on one entity or — with both entity fields omitted — across the whole
     * dataset. Also mutes the matching problems that are already open, so suppressing acts on what
     * is there rather than only on future scans.
     */
    public async createSuppression(datasetId: string, suppression: {code: string; entityType?: string | null; entityId?: string | null; reason?: string | null}): Promise<QualitySuppressionResult> {
        const body: Record<string, unknown> = {code: suppression.code};
        if (suppression.entityType && suppression.entityId) {
            body.entity_type = suppression.entityType;
            body.entity_id = suppression.entityId;
        }
        if (suppression.reason) {
            body.reason = suppression.reason;
        }

        const result: ObjectResult<QualitySuppressionResult> = await this.requestObject(
            '/data_quality/datasets/' + datasetId + '/suppressions',
            body,
            (raw: ApiRecord): QualitySuppressionResult => ({
                suppression: raw.id ? QualitySuppression.parse(raw) : null,
                muted: Number(raw.muted ?? 0),
            }),
            'POST',
        );

        return result.getData() ?? {suppression: null, muted: 0};
    }

    /** Lift a suppression; returns how many muted problems were returned to the open list. */
    public async deleteSuppression(datasetId: string, suppressionId: string): Promise<number> {
        const result: ObjectResult<{reopened: number}> = await this.requestObject(
            '/data_quality/datasets/' + datasetId + '/suppressions/' + suppressionId,
            null,
            (raw: Record<string, unknown>): {reopened: number} => ({reopened: Number(raw.reopened ?? 0)}),
            'DELETE',
        );

        return result.getData()?.reopened ?? 0;
    }
}
