import {Client} from '../Client';
import {ProjectEnvironment} from '../Model/Project/ProjectEnvironment';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = 'http://localhost:5728/';
// const apiEndpoint: string = 'https://api2.attlaz.com';
const clientCredentialClientId: string = 'zSGdVWE3FAS8kY5C';
const clientCredentialClientSecret: string = '6jhYgFPAUm9HmCus';

test('Test get project environment', async () => {

    expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const existingProjectEnvironment: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('11')
    expect(existingProjectEnvironment).not.toBeNull();
    expect(existingProjectEnvironment?.id).toBe('11');

    const nonExistingProjectDeploy: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('random')
    expect(nonExistingProjectDeploy).toBeNull();

});

