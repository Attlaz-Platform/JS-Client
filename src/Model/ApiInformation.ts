/** One API behind the endpoint, as `GET /system/info` reports it. */
export type ApiInfo = {
    name: string;
    /** Null for the gateway; null for every API unless the caller is an administrator. */
    endpoint: string | null;
    routes: { id: string, prefix: string, apiVersion: string }[];
    online: boolean;
    version: string | null;
    libraries: { name: string, version: string }[];
    error: string | null;
};

/**
 * What the endpoint is running.
 *
 * `apis` lists the gateway first, then every API it routes to — but only an administrator is shown
 * more than the gateway, so a normal caller gets a single entry.
 */
export type ApiInformation = {
    /** The gateway's version — what `version` meant before `apis` existed. */
    version: string;
    apis: ApiInfo[];
};
