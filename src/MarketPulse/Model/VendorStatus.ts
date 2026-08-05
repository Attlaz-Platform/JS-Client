import {ApiRecord} from '../../Model/ApiRecord.js';

/** Progress of a match job that is running right now; null when none is. */
export type RunningMatch = {
    productsTotal: number | null;
    productsProcessed: number | null;
    matchesFound: number;
};

/**
 * How fresh a competitor's data is within a catalog — the
 * `/pulse/catalogs/:catalogId/vendors/:vendorId/status` resource.
 *
 * `shouldReindex` / `shouldRematch` are the API's judgement that the vendor's products have moved
 * on since the last index or match run, so the UI can offer to re-run them.
 */
export class VendorStatus {
    public vendorId: string;
    public lastIndexedAt: Date | null = null;
    public lastImportedAt: Date | null = null;
    public lastMatchedAt: Date | null = null;
    public shouldReindex: boolean = false;
    public shouldRematch: boolean = false;
    public runningMatch: RunningMatch | null = null;

    public constructor(vendorId: string) {
        this.vendorId = vendorId;
    }

    public static parse(raw: ApiRecord): VendorStatus {
        const status: VendorStatus = new VendorStatus(raw.vendor as string);
        status.lastIndexedAt = raw.last_indexed_at ? new Date(raw.last_indexed_at as string) : null;
        status.lastImportedAt = raw.last_imported_at ? new Date(raw.last_imported_at as string) : null;
        status.lastMatchedAt = raw.last_matched_at ? new Date(raw.last_matched_at as string) : null;
        status.shouldReindex = raw.should_reindex === true;
        status.shouldRematch = raw.should_rematch === true;

        const running: Record<string, unknown> | null = (raw.running_match as Record<string, unknown> | undefined) ?? null;
        status.runningMatch = running === null ? null : {
            productsTotal: (running.products_total as number | undefined) ?? null,
            productsProcessed: (running.products_processed as number | undefined) ?? null,
            matchesFound: (running.matches_found as number | undefined) ?? 0,
        };

        return status;
    }
}
