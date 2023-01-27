import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {LogQuery} from '../Model/Log/LogQuery';
import {LogStreamId} from '../Model/Log/LogStreamId';
import {Log} from '../Model/Log/Log';
import {LogLevel} from '../Model/Log/LogLevel';
import {LogStreamInformation} from '../Model/Log/LogStreamInformation';
import {FlowRunStats} from '../Model/Flow/FlowRunStats';
import {Utils} from '../Utils';
import * as crypto from 'crypto';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Save run stats', async () => {

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
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
