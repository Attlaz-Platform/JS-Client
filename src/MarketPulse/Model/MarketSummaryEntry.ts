/** One headline figure of the catalog, with its previous-period value to compare against. */
export type MarketSummaryEntry = {
    id: string;
    title: string;
    currentAmount: number;
    previousAmount: number;
};
