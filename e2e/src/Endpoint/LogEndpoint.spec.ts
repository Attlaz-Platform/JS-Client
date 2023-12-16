import {Client, LogStreamId} from '../../../src/index.js';
import {Helper} from '../helper.js';

test('That we can fetch log stream information', async () => {

    expect.assertions(1);
    const client: Client = new Client('', {apiEndpoint: Helper.getEnvValue('apiEndpoint')});
    client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
    // client.getHttpClient().enableDebug();
    const authenticated: boolean = await client.authenticate();

    const logStreamInformation: any = await client.getLogEndPoint().getInformation(new LogStreamId('attlaz:infrastructure'))
    expect(logStreamInformation).not.toBeNull();
});
