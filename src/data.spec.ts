import {Client} from './Client.js';
import {User} from './Model/User.js';
import {Project} from './Model/Project/Project.js';
import {Helper} from '../e2e/src/helper.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get user', async () => {

    expect.assertions(1);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const user: User | null = await client.getUserEndpoint().getUser()
    // console.log('User', user);
    if (user === null) {
        throw new Error('User is null');
    }
    expect(user.email).toBe('demo@attlaz.com');

});
test('Test get project', async () => {

    expect.assertions(1);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const project: Project | null = await client.getProjectEndpoint().getById('8B5C14EBB');
    if (project === null) {
        throw new Error('Project is null');
    }
    // console.log('User', user);

    expect(project.id).toBe('8B5C14EBB');

});
