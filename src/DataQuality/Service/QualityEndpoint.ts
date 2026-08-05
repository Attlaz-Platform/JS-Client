import {path} from '../../Http/Data/Path.js';
import {HttpStatus} from '../../Http/HttpStatus.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {ApiError} from '../../Model/Error/ApiError.js';
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
import {QualityReportEntity} from '../Model/QualityReportEntity.js';
import {QualityReportResult} from '../Model/QualityReportResult.js';
import {QualityScan} from '../Model/QualityScan.js';
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
            path('/data-quality/datasets/:datasetId', {datasetId}),
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
            path('/data-quality/datasets/:datasetId', {datasetId}),
            changes,
            QualityDataset.parse,
            'PATCH',
        );

        return result.getData();
    }

    public async deleteDataset(datasetId: string): Promise<void> {
        await this.requestObject(
            path('/data-quality/datasets/:datasetId', {datasetId}),
            null,
            (raw: unknown): unknown => raw,
            'DELETE',
        );
    }

    public async getEntities(datasetId: string, pagination: CursorPagination | null = null, filters: QualityEntityFilters = {}): Promise<CollectionResult<QualityEntity>> {
        const queryString: QueryString = new QueryString(path('/data-quality/datasets/:datasetId/entities', {datasetId}));
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
        const queryString: QueryString = new QueryString(
            path('/data-quality/datasets/:datasetId/entities/:entityType/:entityId/problems', {datasetId, entityType, entityId}));
        if (includeSuppressed) {
            queryString.set('include_suppressed', 'true');
        }

        return await this.requestCollection(queryString, QualityProblem.parse);
    }

    /** The transition timeline for one problem, oldest first. */
    public async getProblemEvents(datasetId: string, entityType: string, entityId: string, code: string): Promise<CollectionResult<QualityProblemEvent>> {
        const requestPath: string = path(
            '/data-quality/datasets/:datasetId/entities/:entityType/:entityId/problems/:code/events',
            {datasetId, entityType, entityId, code});

        return await this.requestCollection(requestPath, QualityProblemEvent.parse);
    }

    // ---- Ingest ----

    /**
     * Open a scan: the bracket a reporter puts around one run of checks.
     *
     * `pack` names the group of checks this run covers. It scopes what completing the scan is allowed
     * to close, so a partial run cannot resolve problems it never looked at.
     */
    public async openScan(datasetId: string, pack: string | null = null): Promise<QualityScan> {
        const requestPath: string = path('/data-quality/datasets/:datasetId/scans', {datasetId});
        const result: ObjectResult<QualityScan> = await this.requestObject(requestPath, {pack: pack}, QualityScan.parse, 'POST');
        const scan: QualityScan | null = result.getData();
        if (scan === null) {
            throw QualityEndpoint.writeFailed(requestPath);
        }

        return scan;
    }

    /**
     * Report what an open scan found. Safe to call repeatedly to send entities in batches.
     *
     * Entities are created on first report — there is nothing to register up front.
     *
     * **Batch size**: the API caps a request body at 512 KB (the Gateway rejects over 1 MB before it
     * even arrives), and an entity carrying one problem is roughly 250-300 bytes of JSON — so keep
     * batches to a low four figures of entities. An oversize request comes back as `413` with error
     * code `payload_too_large`. Send several batches into the same scan rather than one large one.
     */
    public async reportToScan(datasetId: string, scanId: string, entities: QualityReportEntity[]): Promise<QualityReportResult> {
        return await this.postReport(
            path('/data-quality/datasets/:datasetId/scans/:scanId/report', {datasetId, scanId}),
            {entities: entities.map((entity: QualityReportEntity): Record<string, unknown> => entity.toPayload())},
        );
    }

    /**
     * Close the scan, resolving problems the run covered but did not re-report. Returns how many were
     * resolved.
     *
     * Skipping this leaves problems open that the reporter has already stopped finding.
     */
    public async completeScan(datasetId: string, scanId: string): Promise<number> {
        const requestPath: string = path('/data-quality/datasets/:datasetId/scans/:scanId/complete', {datasetId, scanId});
        const result: ObjectResult<{resolved: number}> = await this.requestObject(
            requestPath,
            {},
            (raw: Record<string, unknown>): {resolved: number} => ({resolved: Number(raw.resolved ?? 0)}),
            'POST',
        );
        const data: {resolved: number} | null = result.getData();
        if (data === null) {
            throw QualityEndpoint.writeFailed(requestPath);
        }

        return data.resolved;
    }

    /**
     * Open a scan, report everything and complete it in one call — for a reporter that already has
     * the full picture in memory and does not need to stream it in batches.
     *
     * Everything goes in one request, so this is bounded by the API's 512 KB body cap — a few
     * thousand entities at most. Beyond that use `openScan` / `reportToScan` / `completeScan`, which
     * can send as many batches as you like into one scan.
     */
    public async reportProblems(datasetId: string, entities: QualityReportEntity[], pack: string | null = null): Promise<QualityReportResult> {
        return await this.postReport(
            path('/data-quality/datasets/:datasetId/problems', {datasetId}),
            {
                pack: pack,
                entities: entities.map((entity: QualityReportEntity): Record<string, unknown> => entity.toPayload()),
            },
        );
    }

    /**
     * Both report routes take the same already-snake_cased body and return the same counts.
     *
     * `_formatted: true` sends the body verbatim. Without it the client's key formatter would rewrite
     * every key and strip the trailing `_id` from `entity_id`, which the endpoint requires.
     */
    private async postReport(requestPath: string, body: Record<string, unknown>): Promise<QualityReportResult> {
        const result: ObjectResult<QualityReportResult> = await this.requestObject(
            requestPath,
            {...body, _formatted: true},
            QualityReportResult.parse,
            'POST',
        );
        const reportResult: QualityReportResult | null = result.getData();
        if (reportResult === null) {
            throw QualityEndpoint.writeFailed(requestPath);
        }

        return reportResult;
    }

    /**
     * A write that came back with nothing — the base Endpoint maps a 404 to null data, and also
     * returns null when the response cannot be parsed.
     *
     * Reads may legitimately answer "no such thing" with null, but a write cannot: returning a zero
     * count here would be indistinguishable from a report that genuinely changed nothing, and a
     * reporter would log success while its problems went nowhere.
     *
     * The message names both causes because the API cannot yet tell them apart — a missing dataset
     * and a path that no longer exists (a reporter still on `/data_quality/`) both come back as a
     * bare 404. Once the API sets an error `code`, branch on that instead.
     */
    private static writeFailed(requestPath: string): ApiError {
        return new ApiError(
            'Data Quality write to `' + requestPath + '` returned nothing. Either the dataset or scan does not exist, '
            + 'or the endpoint does not — check the id, and that the client version matches the API.',
            HttpStatus.HTTP_NOTFOUND,
        );
    }

    /** Clear an entity's problems so the next scan starts from scratch; returns how many were removed. */
    public async resetEntity(datasetId: string, entityType: string, entityId: string): Promise<number> {
        const requestPath: string = path('/data-quality/datasets/:datasetId/entities/:entityType/:entityId/reset', {datasetId, entityType, entityId});

        const result: ObjectResult<{deleted: number}> = await this.requestObject(
            requestPath,
            {},
            (raw: Record<string, unknown>): {deleted: number} => ({deleted: (raw.deleted as number | undefined) ?? 0}),
            'POST',
        );

        return result.getData()?.deleted ?? 0;
    }

    public async getFilterOptions(datasetId: string): Promise<QualityFilterOptions> {
        const result: ObjectResult<QualityFilterOptions> = await this.requestObject(
            path('/data-quality/datasets/:datasetId/filter-options', {datasetId}),
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
            path('/data-quality/datasets/:datasetId/summary', {datasetId}),
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
            path('/data-quality/datasets/:datasetId/entity-problem-suppressions', {datasetId}),
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
            path('/data-quality/datasets/:datasetId/entity-problem-suppressions', {datasetId}),
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
            path('/data-quality/datasets/:datasetId/entity-problem-suppressions/:entityProblemSuppressionId', {datasetId, entityProblemSuppressionId}),
            null,
            (raw: Record<string, unknown>): {reopened: number} => ({reopened: Number(raw.reopened ?? 0)}),
            'DELETE',
        );

        return result.getData()?.reopened ?? 0;
    }
}
