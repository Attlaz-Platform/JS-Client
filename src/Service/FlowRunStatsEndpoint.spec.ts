import * as crypto from 'crypto';
import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {FlowRunStats} from '../Model/Flow/FlowRunStats.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Save run stats', async () => {
    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const flowRunStats: FlowRunStats = new FlowRunStats();
    flowRunStats.flowRunId = 'test-' + crypto.randomUUID().substring(0, 3);
    flowRunStats.time = new Date();

    flowRunStats.memory = 0;
    flowRunStats.memoryLimit = 0;

    flowRunStats.cpu = 0;
    flowRunStats.cpuLimit = 0;

    flowRunStats.networkOutbound = 0;
    flowRunStats.networkInbound = 0;

    flowRunStats.fileRead = 0;
    flowRunStats.fileWrite = 0;

    const savedFlowRunStats: FlowRunStats = await client.getFlowRunStatsEndpoint().create(flowRunStats);

    expect(savedFlowRunStats.flowRunId).toEqual(flowRunStats.flowRunId);
    expect(savedFlowRunStats.time).toEqual(flowRunStats.time);
});
