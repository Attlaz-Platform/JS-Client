import {OAuthClient} from './OAuthClient.js';
import {OAuthClientOptions} from '../OAuthClientOptions.js';
import {OAuthClientToken} from '../OAuthClientToken.js';

/**
 * Signing a request used to write `Authorization` into the client's shared default headers, because
 * getDefaultHeaders() handed out the live object and the request then mutated it. Every later
 * request inherited the token — including the ones that deliberately go out unsigned.
 */
function authenticatedClient(): OAuthClient {
    const client: OAuthClient = new OAuthClient(new OAuthClientOptions('https://gateway.api.attlaz.com'));
    const token: OAuthClientToken = new OAuthClientToken('SECRET-TOKEN-VALUE', 'bearer', null, 'all');
    token.expires = new Date(Date.now() + 3_600_000);
    client.setToken(token);

    return client;
}

describe('OAuthClient header isolation', () => {
    test('signing a request does not write the token into the shared defaults', () => {
        const client: OAuthClient = authenticatedClient();

        (client as any).createRequestData('/projects', null, 'GET', true);

        expect(client.getDefaultHeaders()).not.toHaveProperty('Authorization');
    });

    test('an unsigned request carries no credentials', () => {
        const client: OAuthClient = authenticatedClient();

        // Sign one first: the leak only showed up on the request *after* a signed one.
        (client as any).createRequestData('/projects', null, 'GET', true);
        const unsigned: {headers: Record<string, string>} = (client as any).createRequestData('/users/password', {password: 'x'}, 'POST', false);

        expect(unsigned.headers).not.toHaveProperty('Authorization');
    });

    test('the API version header does not persist either', () => {
        const client: OAuthClient = authenticatedClient();
        client.setVersion('1.242');

        (client as any).createRequestData('/projects', null, 'GET', true);

        expect(client.getDefaultHeaders()).not.toHaveProperty('Attlaz-API-Version');
    });

    test('real defaults still reach the request', () => {
        const client: OAuthClient = authenticatedClient();
        client.addDefaultHeader('x-session', 'payload');

        const request: {headers: Record<string, string>} = (client as any).createRequestData('/projects', null, 'GET', true);

        expect(request.headers['x-session']).toBe('payload');
        expect(request.headers.Authorization).toBe('Bearer SECRET-TOKEN-VALUE');
    });
});
