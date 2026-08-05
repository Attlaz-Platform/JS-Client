import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One reporting run against a dataset — the `/data-quality/datasets/:datasetId/scans` resource.
 *
 * A scan brackets the problems a reporter sends: open one, report into it, complete it. Completing
 * is what lets the platform resolve problems that were not re-reported, so a scan that is opened and
 * never completed leaves stale problems open.
 */
export class QualityScan {
    public id: string;
    public dataset: string;
    /** The check pack this run covers; scopes what auto-close is allowed to resolve. */
    public pack: string | null = null;
    public status: string;
    public startedAt: Date | null = null;
    public completedAt: Date | null = null;

    public constructor(id: string, dataset: string, status: string) {
        this.id = id;
        this.dataset = dataset;
        this.status = status;
    }

    public static parse(raw: ApiRecord): QualityScan {
        const scan: QualityScan = new QualityScan(raw.id as string, raw.dataset as string, raw.status as string);
        scan.pack = (raw.pack as string | undefined) ?? null;
        scan.startedAt = raw.started_at ? new Date(raw.started_at as string) : null;
        scan.completedAt = raw.completed_at ? new Date(raw.completed_at as string) : null;

        return scan;
    }
}
