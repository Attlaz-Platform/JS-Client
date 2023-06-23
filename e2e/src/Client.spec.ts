import {Client, ClientError, OAuthClientToken, User} from '../../src';
import {Helper} from './helper.js';

test('Test authentication', async () => {

    expect.assertions(1);
    const client: Client = new Client(Helper.getEnvValue('apiEndpoint'), Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
    // client.getHttpClient().enableDebug();
    const authenticated: boolean = await client.authenticate();

    const user: User | null = await client.getUserEndpoint().getUser();
    expect(user).not.toBeNull();
});

test('Handle request with invalid or expired token', async () => {

    expect.assertions(1);
    const client: Client = new Client(Helper.getEnvValue('apiEndpoint'), Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
    client.getHttpClient().enableDebug();

    const token: OAuthClientToken = new OAuthClientToken("txVbCqJRHqqI03asKHGzUrsvkwI6KcmIDFbGKDVJ", 'Bearer', "hPpMiU9yxOMD0DreRTrMz2UXa2Vk6bUYc0oIXyMe", "all")
    client.setToken(token);

    return client.getUserEndpoint().getUser().then((result: User | null) => {
        fail('Should not be able to authenticate');
    }, (error) => {
        console.log(error);
        expect(error.message).toBe('Unauthorized');
    });
});
test('Handle refresh token', async () => {

    expect.assertions(1);
    const client: Client = new Client(Helper.getEnvValue('apiEndpoint'), Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
    client.getHttpClient().enableDebug();

    const token: OAuthClientToken = new OAuthClientToken("txVbCqJRHqqI03asKHGzUrsvkwI6KcmIDFbGKDVJ", 'Bearer', "hPpMiU9yxOMD0DreRTrMz2UXa2Vk6bUYc0oIXyMe", "all")
    token.expires = new Date();
    client.setToken(token);

    return client.getUserEndpoint().getUser().then((result: User | null) => {
        fail('Should not be able to authenticate');
    }, (error: ClientError) => {
        expect(error.message).toBe('unauthorized_client');
    });
});
test('Handle multiple refresh tokens at the same time', async () => {

    expect.assertions(10);
    const client: Client = new Client(Helper.getEnvValue('apiEndpoint'), Helper.getEnvValue('passwordFlowClientId'), Helper.getEnvValue('passwordFlowClientSecret'));
    client.getHttpClient().enableDebug();

    await client.authenticate(Helper.getEnvValue('passwordFlowEmail'), Helper.getEnvValue('passwordFlowPassword'));
    /**
     * ToDo: make sure the refresh token is valid!
     */
    const token: OAuthClientToken | null = client.getToken();
    if (token === null) {
        fail('Token should not be null');
    }
    token.expires = new Date('2000-07-21');
    client.setToken(token);

    const x: Promise<(User | null) | ClientError>[] = [];
    for (let i = 0; i < 10; i++) {
        const y: Promise<(User | null) | ClientError> = client.getUserEndpoint().getUser().then((result: User | null) => {
            return result;
        }, (error: ClientError) => {
            return error;
        });
        x.push(y);
    }
    return Promise.all(x).then((results: ((User | null) | ClientError)[]) => {

        console.log(results);
        expect(results).toHaveLength(10);
        for (const result of results) {

            expect(result).toHaveProperty('username');
        }
    });
});
