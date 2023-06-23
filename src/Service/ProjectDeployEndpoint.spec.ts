import {Client} from '../Client.js';
import {CodeDeploy} from '../Model/Project/CodeDeploy.js';
import {Helper} from '../../e2e/src/helper.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get project deploy', async () => {

    expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const existingProjectDeploy: CodeDeploy | null = await client.getCodeDeployEndpoint().getById('5')
    expect(existingProjectDeploy).not.toBeNull();
    expect(existingProjectDeploy?.id).toBe('5');


    const nonExistingProjectDeploy: CodeDeploy | null = await client.getCodeDeployEndpoint().getById('test')
    expect(nonExistingProjectDeploy).toBeNull();

});
