/** An IP currently barred from the API, for a bounded window. */
export type BlockedIp = {id: string; ip: string; from: Date; to: Date; reason: string};
