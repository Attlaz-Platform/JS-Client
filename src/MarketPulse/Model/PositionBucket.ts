/**
 * A product's market position against the median price of its counted competitors, cheapest to most
 * expensive. Mirrors apps-lib's `POSITION_BUCKETS`; the thresholds live server-side.
 */
export const POSITION_BUCKETS = ['very_sharp', 'sharp', 'market_rate', 'expensive', 'much_more_expensive'] as const;
export type PositionBucket = typeof POSITION_BUCKETS[number];
