import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A data-quality dataset: the set of entities being checked, and the problems found on them —
 * the `/data-quality/datasets` resource.
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

    /**
     * Totals for the overview: how much is being watched, and how much currently needs attention.
     * Only the list endpoint counts them — both stay null when a single dataset is fetched.
     */
    public entityCount: number | null = null;
    public openProblemCount: number | null = null;

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
        dataset.entityCount = raw.entity_count === undefined ? null : Number(raw.entity_count);
        dataset.openProblemCount = raw.open_problem_count === undefined ? null : Number(raw.open_problem_count);

        return dataset;
    }
}
