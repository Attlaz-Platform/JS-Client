import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {Project} from '../Model/Project/Project.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {State} from '../Model/State.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get project collection', async () => {
    const expectedActiveProjects = 3;
    const expectedInactiveProjects = 10;
    expect.assertions(1 + (expectedActiveProjects * 2) + 1 + ((expectedActiveProjects + expectedInactiveProjects) * 2));

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    /**
     * Get project by workspace (default only active)
     */
    const projects: CollectionResult<Project> = await client.getProjectEndpoint().getByWorkspace('1ord0LYVekWEyIQUDhLsBLJT9u8');
    expect(projects.getData()).toHaveLength(expectedActiveProjects);

    for (const project of projects.getData()) {
        expect(project.workspaceId.toString()).toEqual('1ord0LYVekWEyIQUDhLsBLJT9u8');
        expect(project.state).toEqual(State.Active);
    }

    /**
     * Get project by workspace (including inactive)
     */
    const projects2: CollectionResult<Project> = await client.getProjectEndpoint().getByWorkspace('1ord0LYVekWEyIQUDhLsBLJT9u8', null, [State.Active, State.Inactive]);
    expect(projects2.getData()).toHaveLength(expectedActiveProjects + expectedInactiveProjects);

    for (const project2 of projects2.getData()) {
        expect(project2.workspaceId.toString()).toEqual('1ord0LYVekWEyIQUDhLsBLJT9u8');
        expect([State.Active, State.Inactive]).toContain(project2.state);
    }
});
