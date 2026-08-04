/** One row of the dataset summary: how many problems of a severity are open on a property. */
export type QualitySummaryRow = {
    property: string;
    severity: string;
    count: number;
};
