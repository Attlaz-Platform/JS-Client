import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {Workspace} from '../Model/Workspace/Workspace';
import {CollectionResult} from '../Model/Result/CollectionResult';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test workspaces', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const existingProjectDeploy: CollectionResult<Workspace> = await client.getWorkspaceEndpoint().getAll()
    expect(existingProjectDeploy).not.toBeNull();
    expect(existingProjectDeploy.hasMore).toBeFalsy();
    expect(existingProjectDeploy.getData()).toHaveLength(2);

});

