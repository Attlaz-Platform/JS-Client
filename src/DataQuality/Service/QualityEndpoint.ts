import {QueryString} from '../../Http/Data/QueryString.js';
import {QualityDataset} from '../Model/QualityDataset.js';
import {QualityEntity} from '../Model/QualityEntity.js';
import {QualityProblem} from '../Model/QualityProblem.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

/** Narrows the entity list; every field is optional and omitted filters are not sent. */
export type QualityEntityFilters = {
    entityType?: string | null;
    status?: string | null;
    search?: string | null;
    severity?: string | null;
    property?: string | null;
};

/** One row of the dataset summary: how many problems of a severity are open on a property. */
export type QualitySummaryRow = {
    property: string;
    severity: string;
    count: number;
};

/** The values the entity list can be filtered on, for the dataset as it currently stands. */
export type QualityFilterOptions = {
    entityTypes: string[];
    properties: string[];
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
        if (filters.search) {
            queryString.set('search', filters.search);
        }
        if (filters.severity) {
            queryString.set('severity', filters.severity);
        }
        if (filters.property) {
            queryString.set('property', filters.property);
        }
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, QualityEntity.parse);
    }

    public async getEntityProblems(datasetId: string, entityType: string, entityId: string): Promise<CollectionResult<QualityProblem>> {
        const path: string = '/data_quality/datasets/' + datasetId
            + '/entities/' + encodeURIComponent(entityType)
            + '/' + encodeURIComponent(entityId) + '/problems';

        return await this.requestCollection(path, QualityProblem.parse);
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
            }),
            'GET',
        );

        return result.getData() ?? {entityTypes: [], properties: []};
    }

    public async getSummary(datasetId: string): Promise<QualitySummaryRow[]> {
        const result: ObjectResult<QualitySummaryRow[]> = await this.requestObject(
            '/data_quality/datasets/' + datasetId + '/summary',
            null,
            (raw: Record<string, unknown>): QualitySummaryRow[] => {
                const rows: Record<string, unknown>[] = (raw.counts as Record<string, unknown>[] | undefined) ?? [];

                return rows.map((row: Record<string, unknown>): QualitySummaryRow => ({
                    property: row.property as string,
                    severity: row.severity as string,
                    count: Number(row.count),
                }));
            },
            'GET',
        );

        return result.getData() ?? [];
    }
}
