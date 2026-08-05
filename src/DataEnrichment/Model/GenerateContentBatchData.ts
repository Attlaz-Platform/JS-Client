/** What to generate, for which resources, using which strategy. */
export type GenerateContentBatchData = {
    name: string;
    strategy: string;
    resourcePool: string;
    resources: string[];
    properties: string[];
};
