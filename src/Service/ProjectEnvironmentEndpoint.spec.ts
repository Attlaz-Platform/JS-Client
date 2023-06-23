import {Client} from '../Client.js';
import {ProjectEnvironment} from '../Model/Project/ProjectEnvironment.js';
import {Helper} from '../../e2e/src/helper.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get project environment by id', async () => {
    expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const existingProjectEnvironment: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('11NqGFf0fh2qCKrm7k28vX5qJ2x');
    expect(existingProjectEnvironment).not.toBeNull();
    expect(existingProjectEnvironment?.id).toBe('11NqGFf0fh2qCKrm7k28vX5qJ2x');

    const nonExistingProjectDeploy: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('random');
    expect(nonExistingProjectDeploy).toBeNull();
});
