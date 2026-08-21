import {Parameters} from '../Data/Parameters.js';
import {OAuthClientOptions} from '../OAuthClientOptions.js';
import {ITransport, ParseErrorHandler} from './ITransport.js';
import {OAuthClient} from './OAuthClient.js';

export interface DirectTransportRoute {
    prefix: string;
    baseUrl: string;
}

/**
 * Transport for internal service-to-service calls that bypasses Gateway OAuth.
 * Authenticates via HMAC-signed session headers instead of an OAuth token.
 *
 * It carries the session payload and its signature without interpreting either: the payload's shape
 * is a contract between Attlaz services, and building it needs `node:crypto` and platform models
 * this package deliberately does not depend on. **Attlaz services should not construct this
 * directly** — use `InternalTransportFactory.asSystem()` from `@attlaz/attlaz-core`, which owns that
 * shape and does the signing.
 *
 * Usage (non-Attlaz callers, or anything supplying its own session):
 *   import {createHmac} from 'node:crypto';
 *   const sessionSignature = createHmac('sha256', apiSecret).update(sessionPayload).digest('hex');
 *   const transport = new DirectTransport('http://core-api:5728', sessionPayload, sessionSignature);
 *   const client = Client.withTransport(transport);
 *
 * With multiple backends:
 *   const transport = new DirectTransport('http://core-api:5728', sessionPayload, sessionSignature, [
 *     { prefix: '/products', baseUrl: 'http://products-api:5730' },
 *     { prefix: '/services', baseUrl: 'http://services-api:5731' },
 *   ]);
 */
export class DirectTransport implements ITransport {
    private readonly clients: Map<string, OAuthClient> = new Map();
    private readonly sortedRoutes: DirectTransportRoute[];
    private parseErrorHandler: ParseErrorHandler | null = null;

    constructor(defaultBaseUrl: string, sessionPayload: string, sessionSignature: string, routes: DirectTransportRoute[] = []) {

        // All routes plus the catch-all default, sorted by prefix length descending (most specific first)
        this.sortedRoutes = [...routes, {prefix: '', baseUrl: defaultBaseUrl}]
            .sort((a, b) => b.prefix.length - a.prefix.length);

        // One OAuthClient per unique base URL with session headers pre-injected
        const allBaseUrls = new Set([defaultBaseUrl, ...routes.map(r => r.baseUrl)]);
        for (const baseUrl of allBaseUrls) {
            const client = new OAuthClient(new OAuthClientOptions(baseUrl));
            client.addDefaultHeader('x-session', sessionPayload);
            client.addDefaultHeader('x-session-signature', sessionSignature);
            this.clients.set(baseUrl, client);
        }
    }

    public async request<T>(action: string, parameters: Parameters = null, method: string = 'GET', _signWithOauthToken: boolean = true): Promise<T> {
        const client = this.resolveClient(action);
        // Always call without OAuth signing — authentication is via the signed session headers
        return await client.request(action, parameters, method, false);
    }

    public async requestBytes(action: string, parameters: Parameters = null, method: string = 'GET', _signWithOauthToken: boolean = true, headers: Record<string, string> = {}): Promise<Buffer> {
        const client = this.resolveClient(action);
        return await client.requestBytes(action, parameters, method, false, headers);
    }

    private resolveClient(action: string): OAuthClient {
        for (const route of this.sortedRoutes) {
            if (action.startsWith(route.prefix)) {
                const client: OAuthClient | undefined = this.clients.get(route.baseUrl);
                if (client !== undefined) {
                    return client;
                }
            }
        }
        throw new Error('No transport route found for action: ' + action);
    }

    public isDebugEnabled(): boolean {
        return false;
    }

    public setParseErrorHandler(handler: ParseErrorHandler | null): void {
        this.parseErrorHandler = handler;
    }

    public reportParseError(message: string, context: Record<string, unknown>): void {
        if (this.parseErrorHandler !== null) {
            this.parseErrorHandler(message, context);
            return;
        }
        console.error(message, context);
    }
}
