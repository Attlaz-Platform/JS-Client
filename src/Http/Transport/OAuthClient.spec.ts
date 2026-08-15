import {afterEach, describe, expect, vi, test} from 'vitest';
import {HttpClient} from '../HttpClient.js';
import {HttpClientResponse} from '../HttpClientResponse.js';
import {OAuthClient} from './OAuthClient.js';
import {OAuthClientOptions} from '../OAuthClientOptions.js';
import {QueryString} from '../Data/QueryString.js';
import {OAuthClientToken} from '../OAuthClientToken.js';

test('Test enum parsing', async () => {
    const options: OAuthClientOptions = new OAuthClientOptions('https://github.com/login', '3b938da6f58d6bef7d59', 'da05698a6bd449de9437e11ff0b99003f511e40f');
    const client: OAuthClient = new OAuthClient(options);

    // client.getClient().cod.getToken()
    // const x: any = await client.authenticate();

    // console.log(x);
    // expect(TriggerType.fromString('webhook')).toBe(TriggerType.Webhook);
    // expect(TaskExecutionStatus.fromString('complete')).toBe(TaskExecutionStatus.Complete);
    // expect(ChannelType.fromString('slack')).toBe(ChannelType.Slack);
    // expect(LogLevel.fromString('debug')).toBe(LogLevel.Debug);
    // expect(ProjectDeployStatus.fromString('complete')).toBe(ProjectDeployStatus.Complete);
    // expect(StorageType.fromString('cache')).toBe(StorageType.Cache);
    // expect(State.fromString('active')).toBe(State.Active);
    // expect(WorkerInstanceState.fromString('started')).toBe(WorkerInstanceState.Started);
    // expect(WorkerState.fromString('active')).toBe(WorkerState.Active);
});
test('Get authorization url', () => {

    const options: OAuthClientOptions = new OAuthClientOptions('https://github.com/', '3b938da6f58d6bef7d59', 'da05698a6bd449de9437e11ff0b99003f511e40f');
    const client: OAuthClient = new OAuthClient(options);

    // expect(client.getAuthorizationUrl()).toEqual('https://github.com/oauth/authorize');

    const queryString: QueryString = new QueryString();
    queryString.set('response_type', 'code');
    // expect(client.getAuthorizationUrl(queryString)).toEqual('https://github.com/oauth/authorize?response_type=code');
})
test('Auth with token', async () => {

    const options: OAuthClientOptions = new OAuthClientOptions('https://api.attlaz.com/', null);
    const client: OAuthClient = new OAuthClient(options);

    const clientToken = new OAuthClientToken('testtoken', 'Bearer', '', '');
    await client.authenticate();

    // expect(client.getAuthorizationUrl()).toEqual('https://github.com/oauth/authorize');

    const queryString: QueryString = new QueryString();
    queryString.set('response_type', 'code');
    // expect(client.getAuthorizationUrl(queryString)).toEqual('https://github.com/oauth/authorize?response_type=code');
})

describe('ensureAccessToken (token-first, credentials-as-fallback)', () => {
    // HttpClient.request is the actual API call, made only after a token is ensured. authenticate()
    // (client_credentials) and refreshToken() are stubbed per test so we assert WHICH acquisition
    // path was taken, without hitting the network.
    const OK_RESPONSE: HttpClientResponse = {body: {}} as unknown as HttpClientResponse;

    const confidentialOptions = (): OAuthClientOptions => new OAuthClientOptions('https://api.attlaz.test', 'client-id', 'client-secret');
    const publicOptions = (): OAuthClientOptions => new OAuthClientOptions('https://api.attlaz.test', 'client-id', null);
    const noCredentialsOptions = (): OAuthClientOptions => new OAuthClientOptions('https://api.attlaz.test', null, null);

    // expires === null means "never expires" (isExpired returns false).
    const validToken = (): OAuthClientToken => new OAuthClientToken('valid-token', 'Bearer', null, '');
    const expiredToken = (refreshToken: string | null): OAuthClientToken => {
        const token: OAuthClientToken = new OAuthClientToken('expired-token', 'Bearer', refreshToken, '');
        token.expires = new Date(0); // 1970 → always in the past
        return token;
    };

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    test('uses a valid token as-is, without acquiring a new one', async () => {
        const httpRequest = vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(confidentialOptions());
        client.setToken(validToken());
        const authenticate = vi.spyOn(client, 'authenticate');
        const refresh = vi.spyOn(client, 'refreshToken');

        await client.request('/x');

        expect(authenticate).not.toHaveBeenCalled();
        expect(refresh).not.toHaveBeenCalled();
        expect(httpRequest).toHaveBeenCalledTimes(1);
    });

    test('mints a token via client_credentials when none is set', async () => {
        const httpRequest = vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(confidentialOptions());
        const authenticate = vi.spyOn(client, 'authenticate').mockImplementation(async (): Promise<boolean> => {
            client.setToken(validToken());
            return true;
        });
        const refresh = vi.spyOn(client, 'refreshToken');

        await client.request('/x');

        expect(authenticate).toHaveBeenCalledTimes(1);
        expect(refresh).not.toHaveBeenCalled();
        expect(httpRequest).toHaveBeenCalledTimes(1);
    });

    test('refreshes an expired token that carries a refresh_token', async () => {
        vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(confidentialOptions());
        client.setToken(expiredToken('refresh-token'));
        const authenticate = vi.spyOn(client, 'authenticate');
        const refresh = vi.spyOn(client, 'refreshToken').mockImplementation(async (): Promise<void> => {
            client.setToken(validToken());
        });

        await client.request('/x');

        expect(refresh).toHaveBeenCalledTimes(1);
        expect(authenticate).not.toHaveBeenCalled();
    });

    test('re-mints via client_credentials when the expired token has no refresh_token', async () => {
        vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(confidentialOptions());
        client.setToken(expiredToken(null));
        const authenticate = vi.spyOn(client, 'authenticate').mockImplementation(async (): Promise<boolean> => {
            client.setToken(validToken());
            return true;
        });
        const refresh = vi.spyOn(client, 'refreshToken');

        await client.request('/x');

        expect(authenticate).toHaveBeenCalledTimes(1);
        expect(refresh).not.toHaveBeenCalled();
    });

    test('throws 401 when there is no token and no usable credentials', async () => {
        const httpRequest = vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(noCredentialsOptions());
        const authenticate = vi.spyOn(client, 'authenticate');

        await expect(client.request('/x')).rejects.toThrow('access token not provided');
        expect(authenticate).not.toHaveBeenCalled();
        expect(httpRequest).not.toHaveBeenCalled();
    });

    test('does not attempt client_credentials for a public client (no secret)', async () => {
        vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(publicOptions());
        const authenticate = vi.spyOn(client, 'authenticate');

        await expect(client.request('/x')).rejects.toThrow('access token not provided');
        expect(authenticate).not.toHaveBeenCalled();
    });

    test('drops a rejected refresh token and stops calling the token endpoint', async () => {
        // The bug this guards: keeping the rejected token made every later request replay the same
        // dead refresh token, and the server's firewall blocks the IP after a handful of those.
        const tokenEndpoint = vi.fn().mockResolvedValue({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            json: async (): Promise<unknown> => ({error: {message: 'invalid_grant'}}),
        });
        vi.stubGlobal('fetch', tokenEndpoint);
        const httpRequest = vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(publicOptions());
        const observed: (OAuthClientToken | null)[] = [];
        client.setTokenChangeHandler((token: OAuthClientToken | null): void => {
            observed.push(token);
        });
        client.setToken(expiredToken('revoked-refresh-token'));

        await expect(client.request('/x')).rejects.toThrow('Refresh token rejected');
        expect(client.getToken()).toBeNull();
        expect(observed).toEqual([null]);

        // The session is gone: further requests fail without touching the token endpoint again.
        await expect(client.request('/y')).rejects.toThrow('access token not provided');
        expect(tokenEndpoint).toHaveBeenCalledTimes(1);
        expect(httpRequest).not.toHaveBeenCalled();
    });

    test('keeps the token when a refresh fails transiently (5xx)', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable',
            json: async (): Promise<unknown> => ({}),
        }));
        const client: OAuthClient = new OAuthClient(publicOptions());
        const token: OAuthClientToken = expiredToken('refresh-token');
        client.setToken(token);

        await expect(client.request('/x')).rejects.toThrow();
        // A hiccup must not end the session — the refresh token is still the caller's only way back.
        expect(client.getToken()).toBe(token);
    });

    test('reports a refreshed token so a consumer can persist the rotated one', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async (): Promise<unknown> => ({
                access_token: 'new-access-token',
                token_type: 'Bearer',
                refresh_token: 'rotated-refresh-token',
                expires_in: 3600,
                scope: 'all',
            }),
        }));
        vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(publicOptions());
        const observed: (OAuthClientToken | null)[] = [];
        client.setTokenChangeHandler((token: OAuthClientToken | null): void => {
            observed.push(token);
        });
        client.setToken(expiredToken('old-refresh-token'));

        await client.request('/x');

        expect(observed).toHaveLength(1);
        expect(observed[0]?.access_token).toBe('new-access-token');
        expect(observed[0]?.refresh_token).toBe('rotated-refresh-token');
    });

    test('single-flights concurrent token acquisition', async () => {
        vi.spyOn(HttpClient, 'request').mockResolvedValue(OK_RESPONSE);
        const client: OAuthClient = new OAuthClient(confidentialOptions());
        let authCalls: number = 0;
        vi.spyOn(client, 'authenticate').mockImplementation(async (): Promise<boolean> => {
            authCalls++;
            await new Promise<void>((resolve) => setTimeout(resolve, 10));
            client.setToken(validToken());
            return true;
        });

        await Promise.all([client.request('/a'), client.request('/b'), client.request('/c')]);

        expect(authCalls).toBe(1);
    });
});
