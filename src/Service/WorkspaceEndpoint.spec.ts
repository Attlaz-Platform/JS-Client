import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {Workspace} from '../Model/Workspace/Workspace.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test workspaces', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const existingProjectDeploy: CollectionResult<Workspace> = await client.getWorkspaceEndpoint().getAll();
    expect(existingProjectDeploy).not.toBeNull();
    expect(existingProjectDeploy.hasMore).toBeFalsy();
    expect(existingProjectDeploy.getData()).toHaveLength(2);
});
test('Test workspace by id', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const workspace: Workspace | null = await client.getWorkspaceEndpoint().getById('1FOkgYfRVyTuOWYfGniNrNOFqTZ');
    if (workspace === null) {
        throw new Error('workspace is null');
    }
    // console.log('User', user);

    expect(workspace.id).toBe('1FOkgYfRVyTuOWYfGniNrNOFqTZ');
    expect(workspace.key).toBe('attlaz');
});
