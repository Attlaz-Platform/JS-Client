import {Client, LogStreamId} from '../../../src/index.js';
import {Helper} from '../helper.js';

test('That we can fetch log stream information', async () => {

    expect.assertions(1);
    const client: Client = new Client('', {apiEndpoint: Helper.getEnvValue('apiEndpoint')});
    client.setClientCredentials(Helper.getEnvValue('clientCredentialClientId'), Helper.getEnvValue('clientCredentialClientSecret'));
    // client.getHttpClient().enableDebug();
    const authenticated: boolean = await client.authenticate();

    // The shared test log stream (Zone.EU_ZONE.TEST_LOG_STREAM in the core library). This used to
    // ask for `attlaz:infrastructure`: log stream ids stopped carrying a type prefix in May 2025 and
    // the API rejects that form, so the test could only ever have failed.
    const logStreamInformation: any = await client.getLogEndPoint().getInformation(new LogStreamId('lst_0nAQnvxYSscFpzE04eVD6VfVfJY'))
    expect(logStreamInformation).not.toBeNull();
});
