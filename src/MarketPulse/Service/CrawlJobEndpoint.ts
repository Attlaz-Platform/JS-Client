import {path} from '../../Http/Data/Path.js';
import {QueryString} from '../../Http/Data/QueryString.js';
import {CatalogId} from '../../Catalog/Model/CatalogId.js';
import {CursorPagination} from '../../Model/Pagination/CursorPagination.js';
import {CrawlJob, CrawlJobStatus} from '../Model/CrawlJob.js';
import {CollectionResult} from '../../Model/Result/CollectionResult.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

/**
 * Market Pulse crawl jobs — `/pulse/crawl-jobs`. Mirrors the PHP client's MarketPulse\CrawlJobEndpoint.
 * A crawl job's lifecycle drives the vendor's "last scraped" timestamp and, on `finished`, triggers
 * post-crawl processing (price history, product matching, price-index snapshots).
 */
export class CrawlJobEndpoint extends Endpoint {

    /** Create a new (pending) crawl job for a vendor. */
    public async create(vendorId: string): Promise<CrawlJob> {
        const result: ObjectResult<CrawlJob> = await this.requestObject(
            '/pulse/crawl-jobs',
            {vendor: vendorId},
            CrawlJob.parse,
            'POST',
        );
        const job: CrawlJob | null = result.getData();
        if (job === null) {
            throw new Error('Unable to create crawl job: empty response');
        }
        return job;
    }

    /** Update a crawl job's status ('started', 'finished', 'cancelled'). */
    public async updateStatus(crawlJobId: string, status: CrawlJobStatus): Promise<CrawlJob> {
        const result: ObjectResult<CrawlJob> = await this.requestObject(
            path('/pulse/crawl-jobs/:crawlJobId', {crawlJobId}),
            {status},
            CrawlJob.parse,
            'PATCH',
        );
        const job: CrawlJob | null = result.getData();
        if (job === null) {
            throw new Error('Unable to update crawl job: empty response');
        }
        return job;
    }

    /** A vendor's crawl jobs (newest first), each with progress (`total` / `processed`). */
    public async getByVendor(vendorId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<CrawlJob>> {
        const queryString: QueryString = new QueryString(path('/pulse/vendors/:vendorId/crawl-jobs', {vendorId}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, CrawlJob.parse);
    }

    /**
     * Crawl jobs across every competitor of a catalog (newest first).
     *
     * A crawl job belongs to a vendor, not to a catalog — the API resolves the catalog's competitors
     * and returns the jobs of their vendors.
     */
    public async getByCatalog(catalogId: CatalogId | string, pagination: CursorPagination | null = null): Promise<CollectionResult<CrawlJob>> {
        const queryString: QueryString = new QueryString(path('/pulse/catalogs/:catalogId/crawl-jobs', {catalogId: catalogId.toString()}));
        queryString.addPagination(pagination);

        return await this.requestCollection(queryString, CrawlJob.parse);
    }

    /** The crawl job with this id, or null. */
    public async getById(crawlJobId: string): Promise<CrawlJob | null> {
        const result: ObjectResult<CrawlJob> = await this.requestObject(
            path('/pulse/crawl-jobs/:crawlJobId', {crawlJobId}),
            null,
            CrawlJob.parse,
            'GET',
        );
        return result.getData();
    }

    /** Register the pages this crawl will process (idempotent server-side). */
    public async registerPages(crawlJobId: string, urls: string[]): Promise<void> {
        await this.postUrls(crawlJobId, '/pages', urls);
    }

    /** Mark pages as crawled (fetched). */
    public async markPagesCrawled(crawlJobId: string, urls: string[]): Promise<void> {
        await this.postUrls(crawlJobId, '/pages/crawled', urls);
    }

    /** Mark pages as parsed (terminal). The crawl auto-finishes once every page is terminal. */
    public async markPagesParsed(crawlJobId: string, urls: string[]): Promise<void> {
        await this.postUrls(crawlJobId, '/pages/parsed', urls);
    }

    /** Mark pages as failed (terminal, e.g. blocked/unfetchable). */
    public async markPagesFailed(crawlJobId: string, urls: string[]): Promise<void> {
        await this.postUrls(crawlJobId, '/pages/failed', urls);
    }

    /** @param suffix a literal trailing segment, e.g. `/pages/crawled` — not caller data. */
    private async postUrls(crawlJobId: string, suffix: string, urls: string[]): Promise<void> {
        if (urls.length === 0) {
            return;
        }
        await this.requestObject(
            path('/pulse/crawl-jobs/:crawlJobId', {crawlJobId}) + suffix,
            {urls},
            (raw: unknown): unknown => raw,
            'POST',
        );
    }
}
