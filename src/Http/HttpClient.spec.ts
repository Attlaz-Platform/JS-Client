import {HttpClient} from './HttpClient.js';
import {HttpClientRequest} from './HttpClientRequest.js';
import {ClientError} from './ClientError.js';

// 10.255.255.1 is non-routable: the connection never completes, so the request only ends when the
// timeout fires. Without one it would hang until the runtime gave up — in a browser, never.
const BLACK_HOLE: string = 'http://10.255.255.1:8080/hang';

describe('HttpClient timeouts', () => {
    test('defaults to 80 seconds, matching the Stripe SDKs', () => {
        expect(HttpClient.DEFAULT_TIMEOUT_MS).toBe(80_000);
    });

    test('aborts a request that does not respond', async () => {
        const request: HttpClientRequest = new HttpClientRequest(BLACK_HOLE, 'GET');

        await expect(HttpClient.request(request, 700)).rejects.toBeInstanceOf(ClientError);
    }, 15_000);

    test('reports the url and the budget, not the raw abort', async () => {
        const request: HttpClientRequest = new HttpClientRequest(BLACK_HOLE, 'GET');

        // AbortSignal rejects with "signal timed out", which says nothing about what was called.
        await expect(HttpClient.request(request, 700)).rejects.toThrow(/timed out after 700ms/);
        await expect(HttpClient.request(request, 700)).rejects.toThrow(/10\.255\.255\.1/);
    }, 15_000);

    test('gives up within the budget rather than hanging', async () => {
        const request: HttpClientRequest = new HttpClientRequest(BLACK_HOLE, 'GET');
        const started: number = Date.now();

        await expect(HttpClient.request(request, 700)).rejects.toThrow();

        // Generous upper bound: the point is that it returns in about the budget, not minutes.
        expect(Date.now() - started).toBeLessThan(5_000);
    }, 15_000);
});
