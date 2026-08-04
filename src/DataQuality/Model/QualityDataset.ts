import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A data-quality dataset: the set of entities being checked, and the problems found on them —
 * the `/data_quality/datasets` resource.
 *
 * `autoCloseMode` decides what happens to an open problem that a later scan no longer reports.
 */
export class QualityDataset {
    public id: string;
    public project: string;
    public name: string;
    public autoCloseMode: string = '';
    public config: Record<string, unknown> | null = null;
    public createdAt: Date | null = null;

    public constructor(id: string, project: string, name: string) {
        this.id = id;
        this.project = project;
        this.name = name;
    }

    public static parse(raw: ApiRecord): QualityDataset {
        const dataset: QualityDataset = new QualityDataset(
            raw.id as string,
            raw.project as string,
            raw.name as string,
        );
        dataset.autoCloseMode = (raw.auto_close_mode as string | undefined) ?? '';
        dataset.config = (raw.config as Record<string, unknown> | undefined) ?? null;
        dataset.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;

        return dataset;
    }
}
