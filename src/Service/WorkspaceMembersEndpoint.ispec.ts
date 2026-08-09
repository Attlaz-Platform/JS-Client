import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {WorkspaceMember} from '../Model/Workspace/WorkspaceMember.js';

vi.setConfig({testTimeout: 60 * 1000});

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test workspace members endpoint', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const workspaceMembers: CollectionResult<WorkspaceMember> = await client.getWorkspaceMemberEndpoint().getByWorkspace('attlaz');

    expect(workspaceMembers).not.toBeNull();
});
