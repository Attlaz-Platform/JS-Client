import {Client} from '../Client';
import {ProjectEnvironment} from '../Model/Project/ProjectEnvironment';
import {Helper} from '../../e2e/src/helper';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

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

