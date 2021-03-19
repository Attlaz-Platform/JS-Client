import {Client} from './Client';
import {User} from './Model/User';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = 'http://localhost:5728/';
const clientCredentialClientId: string = 'zSGdVWE3FAS8kY5C';
const clientCredentialClientSecret: string = '6jhYgFPAUm9HmCus';
const passwordFlowClientId: string = 'MXexCeRqNrGnh5tw';
const passwordFlowClientSecret: string = 'NPYYu6hgMRRzcWN4';
const passwordFlowUsername: string = 'eline@attlaz.com';
const passwordFlowPassword: string = 'koetjeboe';

const tokenExpirationInSeconds: number = 5;
test('Test client credentials flow', async () => {

    expect.assertions(2);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const user: User = await client.getUserEndpoint().getUser()
    // console.log('User', user);

    expect(user.email).toBe('demo@attlaz.com');

    // TODO: how to get the seconds to wait for the token to expire?
    const waitSecondsForTokenToExpire: number = client.getToken().token.expires_in + 5;
    // console.log(client.getToken().expires);

    await new Promise((r) => setTimeout(r, waitSecondsForTokenToExpire * 1000));

    // TODO: make sure we are not authenticated anymore

    expect(client.getToken().expired()).toBeTruthy();
    // const user2: User = await client.getUserEndpoint().getUser()
    // expect(user.email).toBe('demo@attlaz.com');

});
test('Test password authentication - valid', async () => {

    expect.assertions(3);

    let client: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate(passwordFlowUsername, passwordFlowPassword);

    const user: User = await client.getUserEndpoint().getUser()
    // console.log('User', user);

    expect(user.email).toBe('eline@attlaz.com');

    // TODO: how to get the seconds to wait for the token to expire?
    const waitSecondsForTokenToExpire: number = tokenExpirationInSeconds + 5;
    // console.log(client.getToken().expires);

    await new Promise((r) => setTimeout(r, waitSecondsForTokenToExpire * 1000));

    expect(client.getToken().expired()).toBeTruthy();
    const user2: User = await client.getUserEndpoint().getUser()
    expect(user.email).toBe(passwordFlowUsername);

});
test('Test password authentication - invalid', async () => {

    expect.assertions(3);

    let client: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client.getHttpClient().enableDebug();

    await expect(client.authenticate(passwordFlowUsername, 'wrongpassword'))
        .rejects
        .toHaveProperty('code', 'EAUTH');

    await expect(client.getUserEndpoint().getUser())
        .rejects
        .toHaveProperty('message', 'Unable to perform request, access token not provided');

    await expect(client.authenticate('wrongusername', 'wrongpassword'))
        .rejects
        .toHaveProperty('code', 'EAUTH');

});
test('Test set access token + JSON encode', async () => {

    expect.assertions(3);

    let client: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate(passwordFlowUsername, passwordFlowPassword);

    const token = client.getToken();

    expect(token.expired()).toBeFalsy();

    const encoded: string = JSON.stringify(token);

    console.log(encoded);

    const decodedToken: any = JSON.parse(encoded);
    client.setToken(decodedToken);

    const user: User = await client.getUserEndpoint().getUser()
    expect(user.email).toBe(passwordFlowUsername);

    let client2: Client = new Client(apiEndpoint, passwordFlowClientId, passwordFlowClientSecret);
    client2.getHttpClient().enableDebug();

    client.setToken(decodedToken);
    const user2: User = await client2.getUserEndpoint().getUser()
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
