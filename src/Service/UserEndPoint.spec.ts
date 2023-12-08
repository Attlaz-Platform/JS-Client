import * as crypto from 'crypto';
import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {State} from '../Model/State.js';
import {User} from '../Model/User.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test registration of user', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const newUser: User = new User();
    newUser.name = 'Test user';
    newUser.email = 'email-' + crypto.randomUUID().substring(0, 5) + '@domain.com';
    newUser.state = State.Active;
    const registeredUser: User = await client.getUserEndpoint().create(newUser, 'BoyWMpu3N7h47IGt5kKT4FYK');

    expect(registeredUser.email).toEqual(newUser.email);
    expect(registeredUser.id.length).toBeGreaterThan(5);
});
