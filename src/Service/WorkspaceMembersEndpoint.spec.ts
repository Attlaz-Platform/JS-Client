import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {WorkspaceMember} from '../Model/Workspace/WorkspaceMember';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test workspace members endpoint', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const workspaceMembers: CollectionResult<WorkspaceMember> = await client.getWorkspaceMemberEndpoint().getByWorkspace('attlaz');

    expect(workspaceMembers).not.toBeNull();

});

