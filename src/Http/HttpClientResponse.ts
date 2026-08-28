import {Headers} from './Data/Headers.js';

/**
 * A response as it came off the wire. `body` is always bytes — the transport does not interpret,
 * because the caller already knows what it asked for. Use `getJson()` or `getBytes()` to say which.
 *
 * Bytes are a `Uint8Array`, never a `Buffer`: this package runs in the browser as well as in Node,
 * and `Buffer` is a Node global that simply does not exist there — the same reason `Utils` uses
 * `btoa`/`atob`. A `Buffer` IS a `Uint8Array`, so Node callers can still wrap one without a copy
 * (`Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)`) when they want its methods.
 */
export class HttpClientResponse {
    public status: number;
    public statusText: string;
    public body: Uint8Array | null = null;
    public headers: Headers = {};

    public constructor(status: number, statusText: string) {
        this.status = status;
        this.statusText = statusText;
    }

    /** The raw bytes, empty when the response had no body. */
    public getBytes(): Uint8Array {
        return this.body ?? new Uint8Array(0);
    }

    /**
     * The body parsed as JSON, or null when there was none — a 204 and a DELETE that answers empty
     * are normal, and `JSON.parse('')` throws.
     */
    public getJson<T>(): T | null {
        const bytes: Uint8Array = this.getBytes();
        if (bytes.length === 0) {
            return null;
        }
        return JSON.parse(new TextDecoder().decode(bytes)) as T;
    }
}
