// A decoded API response value / record. This models an arbitrary JSON-ish payload (with Date for
// already-parsed date fields) recursively, so nested objects and arrays are represented without
// hardcoding any domain-specific shape. `*.parse(raw: ApiRecord)` factories cast fields at use
// (`raw.id as string`, `raw.time as Date`, `raw.items as ApiRecord[]`). Note: these are unchecked
// assertions — ApiRecord documents the expected shape, it does not validate it at runtime.
export type ApiValue = string | number | boolean | Date | null | ApiValue[] | { [key: string]: ApiValue };

export type ApiRecord = { [key: string]: ApiValue };
