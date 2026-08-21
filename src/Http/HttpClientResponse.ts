import {Headers} from './Data/Headers.js';

/**
 * A response as it came off the wire. `body` is always bytes — the transport does not interpret,
 * because the caller already knows what it asked for. Use `getJson()` or `getBytes()` to say which.
 */
export class HttpClientResponse {
    public status: number;
    public statusText: string;
    public body: Buffer | null = null;
    public headers: Headers = {};

    public constructor(status: number, statusText: string) {
        this.status = status;
        this.statusText = statusText;
    }

    /** The raw bytes, empty when the response had no body. */
    public getBytes(): Buffer {
        return this.body ?? Buffer.alloc(0);
    }

    /**
     * The body parsed as JSON, or null when there was none — a 204 and a DELETE that answers empty
     * are normal, and `JSON.parse('')` throws.
     */
    public getJson<T>(): T | null {
        const bytes: Buffer = this.getBytes();
        if (bytes.length === 0) {
            return null;
        }
        return JSON.parse(bytes.toString('utf8')) as T;
    }
}
