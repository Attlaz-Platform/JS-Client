import {ApiRecord} from '../../Model/ApiRecord.js';

export type IndexJobStatus = 'pending' | 'started' | 'cancelled' | 'stopped' | 'finished';

/**
 * One run of building the embeddings for a vendor's products — the `/pulse/…/index-jobs` resource.
 * Matching a competitor requires its products to be indexed first, so an index job is the step
 * between crawling and {@link ProductMatchJob}.
 */
export class IndexJob {
    public id: string;
    public vendorId: string;
    public status: IndexJobStatus = 'pending';
    public productsTotal: number | null = null;
    public productsProcessed: number | null = null;
    public createdAt: Date | null = null;
    public startedAt: Date | null = null;
    public completedAt: Date | null = null;

    public constructor(id: string, vendorId: string) {
        this.id = id;
        this.vendorId = vendorId;
    }

    public static parse(raw: ApiRecord): IndexJob {
        const job: IndexJob = new IndexJob(raw.id as string, raw.vendor as string);
        job.status = (raw.status as IndexJobStatus | undefined) ?? 'pending';
        job.productsTotal = (raw.products_total as number | undefined) ?? null;
        job.productsProcessed = (raw.products_processed as number | undefined) ?? null;
        job.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        job.startedAt = raw.started_at ? new Date(raw.started_at as string) : null;
        job.completedAt = raw.completed_at ? new Date(raw.completed_at as string) : null;

        return job;
    }
}
