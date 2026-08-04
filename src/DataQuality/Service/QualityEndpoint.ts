import {QueryString} from '../../Http/Data/QueryString.js';
import {ApiRecord} from '../../Model/ApiRecord.js';
import {QualityCodeOption} from '../Model/QualityCodeOption.js';
import {QualityCodeSummaryRow} from '../Model/QualityCodeSummaryRow.js';
import {QualityDataset} from '../Model/QualityDataset.js';
import {QualityEntity} from '../Model/QualityEntity.js';
import {QualityEntityFilters} from '../Model/QualityEntityFilters.js';
import {QualityFilterOptions} from '../Model/QualityFilterOptions.js';
import {QualityProblem} from '../Model/QualityProblem.js';
import {QualityProblemDefinition} from '../Model/QualityProblemDefinition.js';
import {QualityProblemEvent} from '../Model/QualityProblemEvent.js';
import {QualitySummary} from '../Model/QualitySummary.js';
import {QualitySummaryRow} from '../Model/QualitySummaryRow.js';
import {QualityEntityProblemSuppression} from '../Model/QualityEntityProblemSuppression.js';
import {QualityEntityProblemSuppressionResult} from '../Model/QualityEntityProblemSuppressionResult.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

/**
 * Data Quality — `/data-quality/datasets`. A dataset holds the entities being checked and the
 * problems open on them.
 */
export class QualityEndpoint extends Endpoint {

    public async getDatasets(projectId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<QualityDataset>> {
        const queryString: QueryString = new QueryString('/data-quality/datasets');
        queryString.set('project', projectId);
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, QualityDataset.parse);
    }

    public async getDataset(datasetId: string): Promise<QualityDataset | null> {
        const result: ObjectResult<QualityDataset> = await this.requestObject(
            '/data-quality/datasets/' + datasetId,
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
            '/data-quality/datasets',
            body,
            QualityDataset.parse,
            'POST',
        );

        return result.getData();
    }

    public async updateDataset(datasetId: string, changes: {name?: string; autoCloseMode?: string}): Promise<QualityDataset | null> {
        // camelCase keys are snake_cased by the base Endpoint (autoCloseMode -> auto_close_mode).
        const result: ObjectResult<QualityDataset> = await this.requestObject(
            '/data-quality/datasets/' + datasetId,
            changes,
            QualityDataset.parse,
            'PATCH',
        );

        return result.getData();
    }

    public async deleteDataset(datasetId: string): Promise<void> {
        await this.requestObject(
            '/data-quality/datasets/' + datasetId,
            null,
            (raw: unknown): unknown => raw,
            'DELETE',
        );
    }

    public async getEntities(datasetId: string, pagination: CursorPagination | null = null, filters: QualityEntityFilters = {}): Promise<CollectionResult<QualityEntity>> {
        const queryString: QueryString = new QueryString('/data-quality/datasets/' + datasetId + '/entities');
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
        const queryString: QueryString = new QueryString('/data-quality/datasets/' + datasetId
            + '/entities/' + encodeURIComponent(entityType)
            + '/' + encodeURIComponent(entityId) + '/problems');
        if (includeSuppressed) {
            queryString.set('include_suppressed', 'true');
        }

        return await this.requestCollection(queryString, QualityProblem.parse);
    }

    /** The transition timeline for one problem, oldest first. */
    public async getProblemEvents(datasetId: string, entityType: string, entityId: string, code: string): Promise<CollectionResult<QualityProblemEvent>> {
        const path: string = '/data-quality/datasets/' + datasetId
            + '/entities/' + encodeURIComponent(entityType)
            + '/' + encodeURIComponent(entityId)
            + '/problems/' + encodeURIComponent(code) + '/events';

        return await this.requestCollection(path, QualityProblemEvent.parse);
    }

    /** Clear an entity's problems so the next scan starts from scratch; returns how many were removed. */
    public async resetEntity(datasetId: string, entityType: string, entityId: string): Promise<number> {
        const path: string = '/data-quality/datasets/' + datasetId
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
            '/data-quality/datasets/' + datasetId + '/filter-options',
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
            '/data-quality/datasets/' + datasetId + '/summary',
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

    // ---- Problem definitions ----

    /**
     * The catalogue for a project: the platform's definitions plus the project's own. Use it to turn
     * codes into something readable — `summary`/`filter-options` only carry codes that currently
     * have open problems, so a fully suppressed or resolved code has no label there.
     */
    public async getDefinitions(projectId: string, pack: string | null = null): Promise<CollectionResult<QualityProblemDefinition>> {
        const queryString: QueryString = new QueryString('/data-quality/definitions');
        queryString.set('project', projectId);
        if (pack !== null) {
            queryString.set('pack', pack);
        }

        return await this.requestCollection(queryString, QualityProblemDefinition.parse);
    }

    // ---- Suppressions ----

    public async getEntityProblemSuppressions(datasetId: string): Promise<CollectionResult<QualityEntityProblemSuppression>> {
        return await this.requestCollection(
            '/data-quality/datasets/' + datasetId + '/entity-problem-suppressions',
            QualityEntityProblemSuppression.parse,
        );
    }

    /**
     * Suppress a code, either on one entity or — with both entity fields omitted — across the whole
     * dataset. Also mutes the matching problems that are already open, so suppressing acts on what
     * is there rather than only on future scans.
     */
    public async createEntityProblemSuppression(datasetId: string, suppression: {code: string; entityType?: string | null; entityId?: string | null; reason?: string | null}): Promise<QualityEntityProblemSuppressionResult> {
        // Both entity keys are always sent, explicitly null for a dataset-wide suppression: the
        // endpoint requires them to be present so that a dropped or renamed key is an error rather
        // than a silent widening to the whole dataset.
        //
        // `entity`, not `entity_id`: formatKey() strips a trailing `_id`, so `entity_id` is not
        // expressible from this client at all.
        const body: Record<string, unknown> = {
            code: suppression.code,
            entity_type: suppression.entityType ?? null,
            entity: suppression.entityId ?? null,
            reason: suppression.reason ?? null,
        };

        const result: ObjectResult<QualityEntityProblemSuppressionResult> = await this.requestObject(
            '/data-quality/datasets/' + datasetId + '/entity-problem-suppressions',
            body,
            (raw: ApiRecord): QualityEntityProblemSuppressionResult => ({
                suppression: raw.id ? QualityEntityProblemSuppression.parse(raw) : null,
                muted: Number(raw.muted ?? 0),
            }),
            'POST',
        );

        return result.getData() ?? {suppression: null, muted: 0};
    }

    /** Lift a suppression; returns how many muted problems were returned to the open list. */
    public async deleteEntityProblemSuppression(datasetId: string, entityProblemSuppressionId: string): Promise<number> {
        const result: ObjectResult<{reopened: number}> = await this.requestObject(
            '/data-quality/datasets/' + datasetId + '/entity-problem-suppressions/' + entityProblemSuppressionId,
            null,
            (raw: Record<string, unknown>): {reopened: number} => ({reopened: Number(raw.reopened ?? 0)}),
            'DELETE',
        );

        return result.getData()?.reopened ?? 0;
    }
}
