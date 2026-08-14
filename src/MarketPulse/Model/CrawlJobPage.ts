import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One page of a crawl — `pulse.crawl_job_page`.
 *
 * A worker takes pages by claiming them, which is what `status` and `claimedAt` record: a claimed
 * page is nobody else's to fetch until its owner finishes or its lease expires.
 */
export type CrawlJobPageStatus = 'pending' | 'running' | 'complete' | 'failed';

export class CrawlJobPage {
    public id: string;
    public crawlJobId: string;
    public url: string;
    public status: CrawlJobPageStatus = 'pending';
    /** When a worker took this page; its lease runs from here. */
    public claimedAt: Date | null = null;
    /** How many times it has been claimed — a page released by an expired lease is retried. */
    public attempts: number = 0;

    public constructor(id: string, crawlJobId: string, url: string) {
        this.id = id;
        this.crawlJobId = crawlJobId;
        this.url = url;
    }

    public static parse(raw: ApiRecord): CrawlJobPage {
        const page: CrawlJobPage = new CrawlJobPage(
            raw.id as string,
            (raw.crawl_job_id as string | undefined) ?? (raw.crawl_job as string | undefined) ?? '',
            (raw.url as string | undefined) ?? '',
        );
        page.status = ((raw.status as string | undefined) ?? 'pending') as CrawlJobPageStatus;
        page.claimedAt = raw.claimed_at === undefined || raw.claimed_at === null ? null : new Date(raw.claimed_at as string);
        page.attempts = Number(raw.attempts ?? 0);

        return page;
    }
}
