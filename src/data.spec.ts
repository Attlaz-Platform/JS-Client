import {Client} from './Client';
import {User} from './Model/User';
import {Project} from './Model/Project/Project';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = 'http://localhost:5728/';
// const apiEndpoint: string = 'https://api2.attlaz.com';
const clientCredentialClientId: string = 'zSGdVWE3FAS8kY5C';
const clientCredentialClientSecret: string = '6jhYgFPAUm9HmCus';
const passwordFlowClientId: string = 'MXexCeRqNrGnh5tw';
const passwordFlowClientSecret: string = 'NPYYu6hgMRRzcWN4';
const passwordFlowUsername: string = 'eline@attlaz.com';
const passwordFlowPassword: string = 'koetjeboe';

const tokenExpirationInSeconds: number = 5;
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
