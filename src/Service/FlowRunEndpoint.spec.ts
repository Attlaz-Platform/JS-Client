import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {FlowRun} from '../Model/Flow/FlowRun';
import {FlowRunResponse} from '../Model/Flow/FlowRunResponse';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get flow run', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const flowRun: FlowRun | null = await client.getFlowRunEndpoint().getFlowRunSummary('ymdyvYbkz');

    if (flowRun === null) {
        throw new Error('Flow run not found');
    }
    expect(flowRun.id).toEqual('ymdyvYbkz')

});

test('Run Flow', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const flowRunResponse: FlowRunResponse = await client.getFlowRunRequestEndpoint().postFlowRunRequest('BEXG88ATH', {'message': 'test'}, true);

    expect(flowRunResponse.flowRunRequestId).not.toBeUndefined();

});
