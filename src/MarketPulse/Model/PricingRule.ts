import {ApiRecord} from '../../Model/ApiRecord.js';

/**
 * A rule that proposes a new price for part of a catalog — the `/pulse/pricing-rules` resource.
 *
 * `conditions` decides which products it applies to and `actionType` / `actionParams` what it does
 * to their price (match the cheapest competitor, undercut by a percentage, …). The floor and
 * ceiling are guard rails the action may not cross, and `priority` breaks ties when several rules
 * match the same product — lower runs first.
 */
export class PricingRule {
    public id: string;
    public catalogId: string;
    public name: string;
    public description: string | null = null;
    public productGroupId: string | null = null;
    public conditions: Record<string, unknown> = {};
    public actionType: string = '';
    public actionParams: Record<string, unknown> = {};
    public floorMargin: number | null = null;
    public floorPrice: number | null = null;
    public ceilingPrice: number | null = null;
    /** Skip products with no cost price rather than pricing them without a margin guard. */
    public ignoreIfNoCostPrice: boolean = false;
    public priority: number = 0;
    public isActive: boolean = true;
    public createdAt: Date | null = null;
    public updatedAt: Date | null = null;

    public constructor(id: string, catalogId: string, name: string) {
        this.id = id;
        this.catalogId = catalogId;
        this.name = name;
    }

    public static parse(raw: ApiRecord): PricingRule {
        const rule: PricingRule = new PricingRule(
            raw.id as string,
            raw.catalog as string,
            (raw.name as string | undefined) ?? '',
        );
        rule.description = (raw.description as string | undefined) ?? null;
        rule.productGroupId = (raw.product_group as string | undefined) ?? null;
        rule.conditions = (raw.conditions as Record<string, unknown> | undefined) ?? {};
        rule.actionType = (raw.action_type as string | undefined) ?? '';
        rule.actionParams = (raw.action_params as Record<string, unknown> | undefined) ?? {};
        rule.floorMargin = (raw.floor_margin as number | undefined) ?? null;
        rule.floorPrice = (raw.floor_price as number | undefined) ?? null;
        rule.ceilingPrice = (raw.ceiling_price as number | undefined) ?? null;
        rule.ignoreIfNoCostPrice = raw.ignore_if_no_cost_price === true;
        rule.priority = Number(raw.priority ?? 0);
        rule.isActive = raw.is_active !== false;
        rule.createdAt = raw.created_at ? new Date(raw.created_at as string) : null;
        rule.updatedAt = raw.updated_at ? new Date(raw.updated_at as string) : null;

        return rule;
    }
}
