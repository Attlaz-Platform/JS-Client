/** Fields accepted when writing a rule; camelCase keys are snake_cased by the base Endpoint. */
export type PricingRuleData = {
    name: string;
    description?: string | null;
    productGroup?: string | null;
    conditions?: Record<string, unknown>;
    actionType: string;
    actionParams?: Record<string, unknown>;
    floorMargin?: number | null;
    floorPrice?: number | null;
    ceilingPrice?: number | null;
    ignoreIfNoCostPrice?: boolean;
    priority?: number;
    isActive?: boolean;
};
