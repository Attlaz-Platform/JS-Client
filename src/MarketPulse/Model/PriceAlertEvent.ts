import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * One firing of a {@link PriceAlertConfig} — the `/pulse/price-alert-configs/:id/events` resource.
 *
 * `data` holds the values that tripped the condition, so the event stays readable even after the
 * prices move on. Acknowledging one records who dealt with it; it is not deleted.
 */
export class PriceAlertEvent {
    public id: string;
    public alertConfigId: string;
    public catalogProductId: string | null = null;
    public vendorProductId: string | null = null;
    public triggeredAt: Date | null = null;
    public data: Record<string, unknown> = {};
    public acknowledgedAt: Date | null = null;
    public acknowledgedBy: string | null = null;

    public constructor(id: string, alertConfigId: string) {
        this.id = id;
        this.alertConfigId = alertConfigId;
    }

    public get isAcknowledged(): boolean {
        return this.acknowledgedAt !== null;
    }

    public static parse(raw: ApiRecord): PriceAlertEvent {
        const event: PriceAlertEvent = new PriceAlertEvent(raw.id as string, raw.alert_config as string);
        event.catalogProductId = (raw.catalog_product as string | undefined) ?? null;
        event.vendorProductId = (raw.vendor_product as string | undefined) ?? null;
        event.triggeredAt = raw.triggered_at ? new Date(raw.triggered_at as string) : null;
        event.data = (raw.data as Record<string, unknown> | undefined) ?? {};
        event.acknowledgedAt = raw.acknowledged_at ? new Date(raw.acknowledged_at as string) : null;
        event.acknowledgedBy = (raw.acknowledged_by as string | undefined) ?? null;

        return event;
    }
}
