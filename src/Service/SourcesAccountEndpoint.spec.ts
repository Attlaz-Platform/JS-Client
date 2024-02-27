import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Utils} from '../Utils.js';
import {SourcesAccountRepositoryBranch} from '../Model/Deployment/SourcesAccountRepositoryBranch.js';
import {CodeSource} from '../Model/Deployment/CodeSource.js';
import {State} from '../Model/State.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test Get Repositories', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const codeSourceAccountId: string = '1RZpJSaBaO6lALC9lmYUk7h8fVr';
    const repositoryKey: string = Utils.base64decode('YXR0bGF6L2F0dGxhei1wcm9qZWN0LXN5c3RlbQ==');
    const branchesResult: CollectionResult<SourcesAccountRepositoryBranch> = await client.getSourcesAccountEndpoint().getRepositoryBranches(codeSourceAccountId, repositoryKey);

    console.log(branchesResult);
});

test('Test Save code source', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const codeSource: CodeSource = new CodeSource();
    codeSource.codeSourceAccountId = '0.js';
    codeSource.platformId = '0.js';
    codeSource.repository = {name: 'bla.js', key: 'bla.js', url: ''};
    codeSource.branch = 'master.js';
    codeSource.buildStrategyId = '.js';
    codeSource.state = State.Removed;

    const savedCodeSource: CodeSource = await client.getSourcesAccountEndpoint().saveCodeSource(codeSource);

    expect(savedCodeSource.codeSourceAccountId).toEqual(codeSource.codeSourceAccountId);
});
