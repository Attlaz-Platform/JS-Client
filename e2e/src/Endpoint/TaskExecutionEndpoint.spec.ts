import {Client, FlowRunSummary} from '../../../src/index.js';
import {Helper} from '../helper.js';

test('That we get a null and not an error when trying to fetch a non existing task execution summary', async () => {

    expect.assertions(1);
    const client: Client = new Client('', {apiEndpoint: Helper.getEnvValue('apiEndpoint')});
    client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
    // client.getHttpClient().enableDebug();
    const authenticated: boolean = await client.authenticate();

    const taskExecutionSummary: FlowRunSummary | null = await client.getFlowRunEndpoint().getFlowRunSummary('Nonexisting');
    expect(taskExecutionSummary).toBeNull();
});
