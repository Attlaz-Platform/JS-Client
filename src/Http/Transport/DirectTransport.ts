import {Parameters} from '../Data/Parameters.js';
import {OAuthClientOptions} from '../OAuthClientOptions.js';
import {ITransport} from './ITransport.js';
import {OAuthClient} from './OAuthClient.js';

export interface DirectTransportRoute {
    prefix: string;
    baseUrl: string;
}

/**
 * Transport for internal service-to-service calls that bypasses Gateway OAuth.
 * Authenticates via HMAC-signed session headers instead of an OAuth token.
 *
 * The caller is responsible for computing the HMAC signature (since this requires
 * node:crypto which is not available in browser environments).
 *
 * Usage:
 *   import {createHmac} from 'node:crypto';
 *   const sessionPayload = DirectTransport.createSessionPayload();
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

    /**
     * Creates the default session payload for internal service-to-service calls.
     */
    public static createSessionPayload(): string {
        return JSON.stringify({
            api_version: 'latest',
            user: null,
            client: null,
            ip: 'internal',
            roles: [],
            scopes: [],
            access_token: null,
        });
    }

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
}
