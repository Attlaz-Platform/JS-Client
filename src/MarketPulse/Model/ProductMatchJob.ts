import {ApiRecord} from '../../Model/ApiRecord.js';

export type ProductMatchJobStatus = 'pending' | 'started' | 'cancelled' | 'stopped' | 'finished';

/**
 * One run of matching a catalog's products against a competitor's — the `/pulse/match-jobs`
 * resource. `strategy` / `strategyVersion` identify the matching strategy that produced the
 * matches, `matchesFound` is counted per job at read time.
 *
 * The list (`/pulse/catalogs/:catalogId/match-jobs`), the vendor list and the single-job endpoint
 * all return this same shape.
 */
export class ProductMatchJob {
    public id: string;
    public catalogId: string;
    public vendorId: string;
    public strategy: string = '';
    public strategyVersion: string = '';
    public configuration: Record<string, unknown> | null = null;
    public status: ProductMatchJobStatus = 'pending';
    public productsTotal: number | null = null;
    public productsProcessed: number | null = null;
    public matchesFound: number | null = null;
    public createdAt: Date | null = null;
    public startedAt: Date | null = null;
    public completedAt: Date | null = null;

    public constructor(id: string, catalogId: string, vendorId: string) {
        this.id = id;
        this.catalogId = catalogId;
        this.vendorId = vendorId;
    }

    public static parse(raw: ApiRecord): ProductMatchJob {
        const job: ProductMatchJob = new ProductMatchJob(
            raw.id as string,
            raw.catalog as string,
            raw.vendor as string,
        );
        job.strategy = (raw.strategy as string | undefined) ?? '';
        job.strategyVersion = (raw.strategy_version as string | undefined) ?? '';
        job.configuration = (raw.configuration as Record<string, unknown> | undefined) ?? null;
        job.status = (raw.status as ProductMatchJobStatus | undefined) ?? 'pending';
        job.productsTotal = (raw.products_total as number | undefined) ?? null;
        job.productsProcessed = (raw.products_processed as number | undefined) ?? null;
        job.matchesFound = (raw.matches_found as number | undefined) ?? null;
        job.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        job.startedAt = raw.started_at ? new Date(raw.started_at as string) : null;
        job.completedAt = raw.completed_at ? new Date(raw.completed_at as string) : null;

        return job;
    }
}
