import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {Utils} from '../Utils';
import {SourcesAccountRepositoryBranch} from '../Model/Deployment/SourcesAccountRepositoryBranch';
import {CodeSource} from '../Model/Deployment/CodeSource';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test Get Repositories', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const codeSourceAccountId: string = '555abec5-9921-4d4c-939d-0784f9bfa88d';
    const repositoryKey: string = Utils.base64decode('YXR0bGF6L2F0dGxhei1wcm9qZWN0LXN5c3RlbQ==');
    const branchesResult: CollectionResult<SourcesAccountRepositoryBranch> = await client.getSourcesAccountEndpoint().getRepositoryBranches(codeSourceAccountId, repositoryKey);

    console.log(branchesResult);
});

test('Test Save code source', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const codeSource: CodeSource = new CodeSource();
    codeSource.codeSourceAccountId = '0';
    codeSource.platformId = '0';
    codeSource.repository = 'bla';
    codeSource.branch = 'master';
    codeSource.buildStrategyId = '';

    const savedCodeSource: CodeSource = await client.getSourcesAccountEndpoint().saveCodeSource(codeSource);

    expect(savedCodeSource.codeSourceAccountId).toEqual(codeSource.codeSourceAccountId);
});
