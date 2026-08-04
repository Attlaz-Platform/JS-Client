import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A standing rule that watches a catalog's prices against its competitors and notifies a channel
 * when it fires — the `/pulse/price-alert-configs` resource.
 *
 * `conditionType` names the check and `conditionParams` carries its thresholds, so a new kind of
 * alert does not change this shape. `productGroup` narrows it to part of the catalog.
 */
export class PriceAlertConfig {
    public id: string;
    public catalogId: string;
    public name: string;
    public conditionType: string = '';
    public conditionParams: Record<string, unknown> = {};
    public productGroupId: string | null = null;
    /** The messaging channel the alert is delivered to. */
    public channelId: string = '';
    public isActive: boolean = true;
    public createdAt: Date | null = null;

    public constructor(id: string, catalogId: string, name: string) {
        this.id = id;
        this.catalogId = catalogId;
        this.name = name;
    }

    public static parse(raw: ApiRecord): PriceAlertConfig {
        const config: PriceAlertConfig = new PriceAlertConfig(
            raw.id as string,
            raw.catalog as string,
            (raw.name as string | undefined) ?? '',
        );
        config.conditionType = (raw.condition_type as string | undefined) ?? '';
        config.conditionParams = (raw.condition_params as Record<string, unknown> | undefined) ?? {};
        config.productGroupId = (raw.product_group as string | undefined) ?? null;
        config.channelId = (raw.channel_id as string | undefined) ?? '';
        config.isActive = raw.is_active !== false;
        config.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;

        return config;
    }
}
