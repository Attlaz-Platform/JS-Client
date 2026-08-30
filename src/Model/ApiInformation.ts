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
