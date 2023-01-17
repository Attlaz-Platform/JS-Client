import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {LogQuery} from '../Model/Log/LogQuery';
import {LogStreamId} from '../Model/Log/LogStreamId';
import {Log} from '../Model/Log/Log';
import {LogLevel} from '../Model/Log/LogLevel';
import {LogStreamInformation} from '../Model/Log/LogStreamInformation';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Get log stream entries', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const logQuery: LogQuery = new LogQuery(new LogStreamId("UTV0OWtsNXBa"));

    const logItems: CollectionResult<Log> = await client.getLogEndPoint().getLogs(logQuery)

    console.log(logItems);
    expect(logItems.hasMore).toBeTruthy();
    expect(logItems.getData().length).toEqual(100);
});

test('Write to logstream', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const logEntry: Log = new Log(new LogStreamId('UTV0OWtsNXBa'), 'This is a test message0', LogLevel.Debug, new Date());
    logEntry.tags.set('Color', 'Red');
    logEntry.tags.set('Size', 12);
    const savedLogEntry: Log = await client.getLogEndPoint().save(logEntry)

    expect(savedLogEntry.message).toEqual(logEntry.message);
});

test('Get information', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const logStreamInformation: LogStreamInformation | null = await client.getLogEndPoint().getInformation(new LogStreamId('UTV0OWtsNXBa'))
    if (logStreamInformation === null) {
        throw new Error('Log stream not found')
    }

    expect(logStreamInformation.logStreamId.id).toEqual('UTV0OWtsNXBa');
});
