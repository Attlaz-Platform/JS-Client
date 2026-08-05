import {OAuthClient} from './OAuthClient.js';
import {OAuthClientOptions} from '../OAuthClientOptions.js';
import {ClientError} from '../ClientError.js';

/**
 * The token endpoint bypasses HttpClient, so it did not inherit its timeout: authenticate() and
 * refreshToken() against an unresponsive endpoint hung indefinitely. That is the one call every
 * client makes before it can do anything else.
 *
 * 10.255.255.1 is non-routable, so the connection never completes.
 */
function blackHoleClient(timeoutMs: number): OAuthClient {
    const options: OAuthClientOptions = new OAuthClientOptions('http://10.255.255.1:8080', 'id', 'secret');
    options.timeoutMs = timeoutMs;

    return new OAuthClient(options);
}

describe('OAuth token request timeout', () => {
    test('authenticate() gives up instead of hanging', async () => {
        const started: number = Date.now();

        await expect(blackHoleClient(700).authenticate()).rejects.toBeInstanceOf(ClientError);

        expect(Date.now() - started).toBeLessThan(5_000);
    }, 15_000);

    test('names the token url and the budget', async () => {
        // The raw abort message ("The operation was aborted due to timeout") says nothing about
        // which call died.
        await expect(blackHoleClient(700).authenticate()).rejects.toThrow(/timed out after 700ms/);
        await expect(blackHoleClient(700).authenticate()).rejects.toThrow(/10\.255\.255\.1/);
    }, 15_000);
});
