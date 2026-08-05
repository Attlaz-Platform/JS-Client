/** Fields accepted when creating an alert; camelCase keys are snake_cased by the base Endpoint. */
export type PriceAlertConfigData = {
    name: string;
    conditionType: string;
    conditionParams?: Record<string, unknown>;
    productGroup?: string | null;
    channelId: string;
    isActive?: boolean;
};
