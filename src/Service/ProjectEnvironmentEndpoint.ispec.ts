import {Client} from '../Client.js';
import {ProjectEnvironment} from '../Model/Project/ProjectEnvironment.js';
import {Helper} from '../../e2e/src/helper.js';

vi.setConfig({testTimeout: 60 * 1000});

const apiEndpoint: string = Helper.getApiEndpoint('live')
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get project environment by id', async () => {
    expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});

    client.setVersion(Helper.getApiVersion());
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const existingProjectEnvironment: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('11NqGFf0fh2qCKrm7k28vX5qJ2x');
    expect(existingProjectEnvironment).not.toBeNull();
    expect(existingProjectEnvironment?.id).toBe('11NqGFf0fh2qCKrm7k28vX5qJ2x');

    const nonExistingProjectDeploy: ProjectEnvironment | null = await client.getProjectEnvironmentEndpoint().getById('random');
    expect(nonExistingProjectDeploy).toBeNull();
});
// test('Test get project environment configuration', async () => {
//     expect.assertions(3);
//
//     const client: Client = new Client('', {apiEndpoint: apiEndpoint});
//     client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
//     client.getHttpClient().enableDebug();
//
//     await client.authenticate();
//
//     const configuration: ProjectEnvironmentConfiguration | null = await client.getProjectEnvironmentEndpoint().getConfigByKey('1tWWv6mQiG8dGwpPH7CdAnsxSfi', 'flow_run_queue_name');
//     expect(configuration).not.toBeNull();
//     expect(configuration?.id).toBe('2Z340crbywJW8P5jHIohggdsIwC');
//     expect(configuration?.value).toBe('flowrun.audiosense.staging');
//
//     console.log(configuration);
// });
// test('Test get non existing project environment configuration', async () => {
//     expect.assertions(1);
//
//     const client: Client = new Client('', {apiEndpoint: apiEndpoint});
//     client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
//     client.getHttpClient().enableDebug();
//
//     await client.authenticate();
//
//     const configuration: ProjectEnvironmentConfiguration | null = await client.getProjectEnvironmentEndpoint().getConfigByKey('1tWWv6mQiG8dGwpPH7CdAnsxSfi', 'som_non_existing_key');
//     expect(configuration).toBeNull();
//
//
//     console.log(configuration);
// });
