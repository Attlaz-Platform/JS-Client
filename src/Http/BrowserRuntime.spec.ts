import {afterEach, describe, expect, test} from 'vitest';
import {HttpClient} from './HttpClient.js';
import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';

/**
 * This package ships to the browser as well as to Node, and nothing else in the suite proves it.
 * Every other test runs under Node, where `Buffer` and `process` exist — so code that can only work
 * in Node compiles, type-checks (tsconfig sets `types: ["node"]`) and passes the whole suite while
 * being a guaranteed `ReferenceError` in a browser.
 *
 * That is not hypothetical: `Buffer.from(await response.arrayBuffer())` on the response path
 * shipped in 1.112.0 and broke *every* API call in the dashboard, reported only as "Unknown error"
 * because the transport replaces the message of anything that is not a ClientError.
 *
 * The lint rule (`no-restricted-globals` over `src/`) catches a Node global written here. This
 * catches the rest: a transitive dependency reaching for one, or a web API that only looks
 * universal. It hides the Node-only globals and drives a real request through the client.
 *
 * `fetch` is stubbed with a duck-typed response rather than a real `Response`, deliberately: Node's
 * own `Response` implementation uses `Buffer` internally, so building one here would fail for
 * reasons that have nothing to do with the client.
 */
describe('browser runtime', () => {

    const NODE_GLOBALS: string[] = ['Buffer', 'process', '__dirname', '__filename'];
    const saved: Record<string, unknown> = {};

    const withoutNodeGlobals = async <T>(body: () => Promise<T>): Promise<T> => {
        for (const name of NODE_GLOBALS) {
            saved[name] = (globalThis as Record<string, unknown>)[name];
            delete (globalThis as Record<string, unknown>)[name];
        }
        try {
            return await body();
        } finally {
            for (const name of NODE_GLOBALS) {
                if (saved[name] !== undefined) {
                    (globalThis as Record<string, unknown>)[name] = saved[name];
                }
            }
        }
    };

    const respondWith = (payload: Uint8Array, status: number = 200): void => {
        (globalThis as Record<string, unknown>).fetch = async (): Promise<unknown> => ({
            ok: status >= 200 && status < 300,
            status,
            statusText: 'OK',
            headers: {forEach: (): void => {}},
            arrayBuffer: async (): Promise<ArrayBuffer> => payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength) as ArrayBuffer,
            text: async (): Promise<string> => new TextDecoder().decode(payload),
        });
    };

    const realFetch: unknown = globalThis.fetch;
    afterEach(() => {
        (globalThis as Record<string, unknown>).fetch = realFetch;
    });

    /** Returns the response itself: only the caller knows whether this body is JSON or bytes. */
    const get = async (): Promise<HttpClientResponse> =>
        HttpClient.request(new HttpClientRequest('https://example.test/users/me', 'GET'), 5000);

    test('a JSON response parses with no Node globals available', async () => {
        respondWith(new TextEncoder().encode('{"id":"usr_x","name":"Test"}'));

        const response: HttpClientResponse = await withoutNodeGlobals(get);

        expect(response.getJson()).toEqual({id: 'usr_x', name: 'Test'});
    });

    test('bytes come back as a Uint8Array, the type both runtimes share', async () => {
        // 0xff is not valid UTF-8, so a decode round trip would corrupt it.
        respondWith(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0xff, 0x00]));

        const response: HttpClientResponse = await withoutNodeGlobals(get);

        expect(response.getBytes()).toBeInstanceOf(Uint8Array);
        expect(Array.from(response.getBytes())).toEqual([0x89, 0x50, 0x4e, 0x47, 0xff, 0x00]);
    });

    test('an empty body is null rather than a parse error', async () => {
        respondWith(new Uint8Array(0));

        const response: HttpClientResponse = await withoutNodeGlobals(get);

        expect(response.getJson()).toBeNull();
    });
});
