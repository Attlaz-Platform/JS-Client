import {Helper} from './helper.js';
import {Client, ClientError, HttpClient, OAuthClientToken, User} from '../../src/index.js';

describe('Client', () => {


    test('Test client credentials authentication', async () => {

        expect.assertions(1);
        const client: Client = new Client('', {endpoint: Helper.getEnvValue('apiEndpoint')});
        client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
        client.getHttpClient().enableDebug();
        const authenticated: boolean = await client.authenticate();

        const user: User | null = await client.getUserEndpoint().getUser();
        expect(user).not.toBeNull();
        if (user === null) {
            fail('User is null');
        }
        expect(user.email).toBe('demo@attlaz.com');
    });
    test('Test token authentication', async () => {

        expect.assertions(1);
        const client: Client = new Client(Helper.getEnvValue('workingAccessTokenForAuthentication'), {endpoint: Helper.getEnvValue('apiEndpoint')});
        client.getHttpClient().enableDebug();

        // const authenticated: boolean = await client.authenticate();

        const user: User | null = await client.getUserEndpoint().getUser();
        expect(user).not.toBeNull();
        console.log(user);
    });
    test('Handle request with invalid or expired token', async () => {

        expect.assertions(2);
        const client: Client = new Client('', {endpoint: Helper.getEnvValue('apiEndpoint')});
        client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
        client.getHttpClient().enableDebug();

        const token: OAuthClientToken = new OAuthClientToken(Helper.getEnvValue('test-invalid-access-token'), 'Bearer', Helper.getEnvValue('test-invalid-refresh-token'), "all")
        client.setToken(token);

        return client.getUserEndpoint().getUser().then((result: User | null) => {
            fail('Should not be able to authenticate');
        }, (error) => {
            expect(error.code).toBe(HttpClient.HTTP_UNAUTHORIZED);
            expect(error.name).toBe('Unauthorized');
        });
    });
    test('Handle refresh token', async () => {

        expect.assertions(2);


        const client: Client = new Client('', {endpoint: Helper.getEnvValue('apiEndpoint')});
        client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
        client.getHttpClient().enableDebug();

        const token: OAuthClientToken = new OAuthClientToken(Helper.getEnvValue('test-refresh-access-token'), 'Bearer', Helper.getEnvValue('test-refresh-refresh-token'), "all")
        token.expires = new Date();
        client.setToken(token);

        return client.getUserEndpoint().getUser().then((result: User | null) => {
            fail('Should not be able to authenticate');
        }, (error: ClientError) => {
            expect(error.code).toBe(HttpClient.HTTP_UNAUTHORIZED);
            expect(error.name).toBe('Unauthorized');
        });
    });
    test('Handle multiple refresh tokens at the same time', async () => {

        expect.assertions(10);
        const client: Client = new Client('', {endpoint: Helper.getEnvValue('apiEndpoint')});
        client.setClientCredentials(Helper.getEnvValue('passwordFlowClientId'), Helper.getEnvValue('passwordFlowClientSecret'));
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
});
