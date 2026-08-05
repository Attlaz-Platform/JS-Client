/** How many products fall in a segment now versus the previous period. */
export type ProductsSegment = {
    code: string;
    current: number;
    previous: number;
};
