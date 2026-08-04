/** A code with its label and open count, so a filter control can show the label not the raw code. */
export type QualityCodeOption = {
    code: string;
    label: string | null;
    count: number;
};
