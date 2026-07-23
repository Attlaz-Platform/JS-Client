import {ApiRecord} from '../ApiRecord.js';

export type CrawlJobStatus = 'pending' | 'started' | 'cancelled' | 'finished';

/**
 * A Market Pulse crawl job: one run of scraping a vendor. Its lifecycle (pending → started →
 * finished) drives the vendor's "last scraped" timestamp (`finishedAt`) and, on finish, triggers
 * post-crawl processing (price history, product matching, …).
 */
export class CrawlJob {
    public id: string;
    public vendorId: string;
    public status: CrawlJobStatus;
    public requestedAt: Date | null;
    public startedAt: Date | null;
    public finishedAt: Date | null;

    public constructor(id: string, vendorId: string) {
        this.id = id;
        this.vendorId = vendorId;
        this.status = 'pending';
        this.requestedAt = null;
        this.startedAt = null;
        this.finishedAt = null;
    }

    public static parse(raw: ApiRecord): CrawlJob {
        const job: CrawlJob = new CrawlJob(raw.id as string, (raw.vendor ?? raw.vendor_id) as string);
        job.status = (raw.status as CrawlJobStatus) ?? 'pending';
        job.requestedAt = raw.requested_at ? new Date(raw.requested_at as string) : null;
        job.startedAt = raw.started_at ? new Date(raw.started_at as string) : null;
        job.finishedAt = raw.finished_at ? new Date(raw.finished_at as string) : null;
        return job;
    }
}
