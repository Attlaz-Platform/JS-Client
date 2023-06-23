import {Client} from './Client.js';
import {User} from './Model/User.js';
import {OAuthClientToken} from './Http/OAuthClientToken.js';
import {Utils} from './Utils.js';
import {HttpClient} from './Http/HttpClient.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = 'http://localhost:5728/';
// const apiEndpoint: string = 'https://api2.attlaz.com';
const clientCredentialClientId: string = 'zSGdVWE3FAS8kY5C';
const clientCredentialClientSecret: string = '6jhYgFPAUm9HmCus';
const passwordFlowClientId: string = 'MXexCeRqNrGnh5tw';
const passwordFlowClientSecret: string = 'NPYYu6hgMRRzcWN4';
const passwordFlowUsername: string = 'demo@attlaz.com';
const passwordFlowPassword: string = 'Kd9X&jKiSJDXb3@cTq';

const tokenExpirationInSeconds: number = 5;
test('Test client credentials flow', async () => {
    expect.assertions(2);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const user: User | null = await client.getUserEndpoint().getUser();
    if (user === null) {
        throw new Error('User is null');
    }
    // console.log('User', user);

    expect(user.email).toBe('demo@attlaz.com');

    // TODO: how to get the seconds to wait for the token to expire?
    const token: OAuthClientToken | null = client.getToken();
    if (token === null) {
        throw new Error('Token is null');
    }
    if (token.expires === null) {
        throw new Error('Token expires not set');
    }
    const expiresIn: number = token.expires.getTime() - (new Date()).getTime();
    if (expiresIn < 30) {
        const waitSecondsForTokenToExpire: number = expiresIn + 5;
        // console.log(client.getToken().expires);

        await new Promise((r) => setTimeout(r, waitSecondsForTokenToExpire * 1000));

        // TODO: make sure we are not authenticated anymore

        const token: OAuthClientToken | null = client.getToken();
        if (token === null) {
            throw new Error('Token is null');
        }
        expect(OAuthClientToken.isExpired(token)).toBeTruthy();
    }
    // const user2: User = await client.getUserEndpoint().getUser()
    // expect(user.email).toBe('demo@attlaz.com');
});
test('Test password authentication - valid', async () => {
    expect.assertions(3);

    const client: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate(passwordFlowUsername, passwordFlowPassword);

    const user: User | null = await client.getUserEndpoint().getUser();

    if (user === null) {
        throw new Error('User is null');
    }
    // console.log('User', user);

    expect(user.email).toBe('demo@attlaz.com');

    // TODO: how to get the seconds to wait for the token to expire?
    const waitSecondsForTokenToExpire: number = tokenExpirationInSeconds + 5;
    // console.log(client.getToken().expires);

    await new Promise((r) => setTimeout(r, waitSecondsForTokenToExpire * 1000));

    const token: OAuthClientToken | null = client.getToken();
    if (token === null) {
        throw new Error('Token is null');
    }
    expect(OAuthClientToken.isExpired(token)).toBeTruthy();
    const user2: User | null = await client.getUserEndpoint().getUser();
    if (user2 === null) {
        throw new Error('User2 is null');
    }
    expect(user2.email).toBe(passwordFlowUsername);
});
test('Test password authentication - invalid', async () => {
    expect.assertions(3);

    const client: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client.getHttpClient().enableDebug();

    await expect(client.authenticate(passwordFlowUsername, 'wrongpassword'))
        .rejects
        .toHaveProperty('code', HttpClient.HTTP_UNAUTHORIZED);

    await expect(client.getUserEndpoint().getUser())
        .rejects
        .toHaveProperty('message', 'Unable to perform request, access token not provided');

    await expect(client.authenticate('wrongusername', 'wrongpassword'))
        .rejects
        .toHaveProperty('code', HttpClient.HTTP_UNAUTHORIZED);
});
test('Test set access token + JSON encode', async () => {
    expect.assertions(4);

    const client: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate(passwordFlowUsername, passwordFlowPassword);

    const token: OAuthClientToken | null = client.getToken();
    if (token === null) {
        throw new Error('Token is null');
    }

    expect(OAuthClientToken.isExpired(token)).toBeFalsy();

    const encoded: string = OAuthClientToken.serialize(token);

    console.log(encoded);

    const decodedToken: any = OAuthClientToken.deserialize(encoded);
    client.setToken(decodedToken);

    const user: User | null = await client.getUserEndpoint().getUser();
    if (user === null) {
        throw new Error('User is null');
    }
    expect(user.email).toBe(passwordFlowUsername);

    const client2: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client2.getHttpClient().enableDebug();

    console.log(decodedToken);

    client2.setToken(decodedToken);

    expect(client2.getToken()).toStrictEqual(client.getToken());

    const user2: User | null = await client2.getUserEndpoint().getUser();
    if (user2 === null) {
        throw new Error('User2 is null');
    }
    expect(user2.email).toBe(passwordFlowUsername);

    // const newToken = client.setAccessToken()

    //
    //
    //
    //
    // client.setAccessToken('nonexisint', 'hmmz');
    //
    // await expect(client.getUserEndpoint().getUser())
    //     .rejects
    //     .toHaveProperty('message', 'Unable to perform request, access token not provided');
    //
    // await expect(client.authenticate('wrongusername', 'wrongpassword'))
    //     .rejects
    //     .toHaveProperty('code', 'EAUTH');
});

test('Test set expired tokens', async () => {
    expect.assertions(4);

    const client: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client.getHttpClient().enableDebug();

    const encodedToken: string = Utils.base64decode('eyJhY2Nlc3NfdG9rZW4iOiJvZVZpYXVhdk9wTkNpekNLRmxXUGpuaEI5aHNSdFViMFFTTVJlQWFuIiwidG9rZW5fdHlwZSI6ImJlYXJlciIsInJlZnJlc2hfdG9rZW4iOiJ4N0pINTVaR3U5OGFPN3VQaGlmS2RZME8yc3BYS0IzN296bElDUGtJIiwiZXhwaXJlcyI6IjIwMjEtMDMtMTlUMjE6MTQ6MTkuNzkyWiIsInNjb3BlIjoiYWxsIn0=');

    const token: OAuthClientToken = OAuthClientToken.deserialize(encodedToken);

    client.setToken(token);

    expect(OAuthClientToken.isExpired(token)).toBeTruthy();
    expect(client.getHttpClient().isTokenExpires()).toBeTruthy();

    await expect(client.getHttpClient().refreshToken())
        .rejects
        .toHaveProperty('code', HttpClient.HTTP_UNAUTHORIZED);

    await expect(client.getUserEndpoint().getUser())
        .rejects
        .toHaveProperty('code', HttpClient.HTTP_UNAUTHORIZED);

    // const user: User = await client.getUserEndpoint().getUser()
    // expect(user.email).toBe(passwordFlowUsername);
    //
    // let client2: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    // client2.getHttpClient().enableDebug();
    //
    // console.log(decodedToken);
    //
    // client2.setToken(decodedToken);
    //
    // expect(client2.getToken()).toStrictEqual(client.getToken());
    //
    // const user2: User = await client2.getUserEndpoint().getUser()
    // expect(user2.email).toBe(passwordFlowUsername);

    // const newToken = client.setAccessToken()

    //
    //
    //
    //
    // client.setAccessToken('nonexisint', 'hmmz');
    //
    // await expect(client.getUserEndpoint().getUser())
    //     .rejects
    //     .toHaveProperty('message', 'Unable to perform request, access token not provided');
    //
    // await expect(client.authenticate('wrongusername', 'wrongpassword'))
    //     .rejects
    //     .toHaveProperty('code', 'EAUTH');
});
