import {Client} from '../Client';
import {ProjectDeploy} from '../Model/Project/ProjectDeploy';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = 'http://localhost:5728/';
// const apiEndpoint: string = 'https://api2.attlaz.com';
const clientCredentialClientId: string = 'zSGdVWE3FAS8kY5C';
const clientCredentialClientSecret: string = '6jhYgFPAUm9HmCus';

test('Test get project deploy', async () => {

    expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const existingProjectDeploy: ProjectDeploy | null = await client.getProjectDeployEndpoint().getById('5')
    expect(existingProjectDeploy).not.toBeNull();
    expect(existingProjectDeploy?.id).toBe('5');

    const nonExistingProjectDeploy: ProjectDeploy | null = await client.getProjectDeployEndpoint().getById('test')
    expect(nonExistingProjectDeploy).toBeNull();

});

