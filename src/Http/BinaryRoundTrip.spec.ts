import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {createServer, IncomingMessage, Server, ServerResponse} from 'node:http';
import {AddressInfo} from 'node:net';
import {OAuthClient} from './Transport/OAuthClient.js';
import {OAuthClientOptions} from './OAuthClientOptions.js';

/**
 * Bytes must survive the client end to end. Nothing else in the suite proves this: a transport that
 * corrupts binary still compiles, still type-checks, and still passes every other test — which is
 * exactly how a Buffer serialised as `{"type":"Buffer","data":[…]}` reached a review once already.
 *
 * Runs against a throwaway loopback server, so it needs no infrastructure.
 */
describe('binary round trip', () => {

    /** Bytes chosen to break a UTF-8 decode: a PNG header, a lone 0xFF, and an unpaired surrogate. */
    const PAYLOAD: Buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0xff, 0xd8, 0xed, 0xa0, 0x80, 0x00]);

    let server: Server;
    let received: Buffer = Buffer.alloc(0);
    let receivedContentType: string | undefined;
    let receivedAccept: string | undefined;
    let receivedExpiration: string | undefined;
    let baseUrl: string = '';

    beforeAll(async () => {
        server = createServer((request: IncomingMessage, response: ServerResponse): void => {
            receivedAccept = request.headers.accept;

            if (request.method === 'POST') {
                receivedContentType = request.headers['content-type'];
                receivedExpiration = request.headers['x-attlaz-expiration'] as string | undefined;
                const chunks: Buffer[] = [];
                request.on('data', (chunk: Buffer) => chunks.push(chunk));
                request.on('end', () => {
                    received = Buffer.concat(chunks);
                    response.writeHead(200, {'content-type': 'application/json'});
                    response.end('{"data":{"ok":true}}');
                });
                return;
            }

            response.writeHead(200, {'content-type': 'application/octet-stream'});
            response.end(PAYLOAD);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        baseUrl = 'http://127.0.0.1:' + (server.address() as AddressInfo).port;
    });

    afterAll(async () => {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    });

    const client = (): OAuthClient => new OAuthClient(new OAuthClientOptions(baseUrl));

    test('bytes come back identical, not UTF-8 mangled', async () => {
        const result: Buffer = await client().requestBytes('/item', null, 'GET', false);

        expect(result.length).toBe(PAYLOAD.length);
        expect(result.equals(PAYLOAD)).toBe(true);
    });

    test('asks for octet-stream, so the server knows to send bytes', async () => {
        await client().requestBytes('/item', null, 'GET', false);
        expect(receivedAccept).toBe('application/octet-stream');
    });

    test('sends a Buffer as its bytes, not as a serialised object', async () => {
        await client().requestBytes('/item', PAYLOAD, 'POST', false);

        expect(received.equals(PAYLOAD)).toBe(true);
        expect(receivedContentType).toBe('application/octet-stream');
        // The failure this guards: JSON.stringify(Buffer) yields {"type":"Buffer","data":[…]}.
        expect(received.toString('utf8').startsWith('{"type":"Buffer"')).toBe(false);
    });

    test('carries metadata in a header, since the body is the value', async () => {
        await client().requestBytes('/item', PAYLOAD, 'POST', false, {'X-Attlaz-Expiration': '2026-09-01T00:00:00.000Z'});
        expect(receivedExpiration).toBe('2026-09-01T00:00:00.000Z');
    });

    test('a JSON response still parses through the normal path', async () => {
        const result: {data: {ok: boolean}} = await client().request('/item', {a: 1}, 'POST', false);
        expect(result.data.ok).toBe(true);
    });
});
