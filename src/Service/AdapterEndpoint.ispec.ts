import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Adapter} from '../Model/Adapter/Adapter.js';
import {AdapterConnection} from '../Model/Adapter/AdapterConnection.js';
import {AdapterConnectionConfigurationValue} from '../Model/Adapter/AdapterConnectionConfigurationValue.js';

vi.setConfig({testTimeout: 60 * 1000});

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get connections', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: CollectionResult<Adapter> = await client.getAdapterEndpoint().getAdapters();

    expect(adapterCollectionResult.getData().length).toBeGreaterThan(0);
});
test('Test get connection', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: AdapterConnection | null = await client.getAdapterConnectionEndpoint().getConnectionByKey('1dCxPOug1npDYEPY7W719a9CszW', 'magento_ssh');

    if (adapterCollectionResult === null) {
        throw new Error('Connection not found');
    }
    expect(adapterCollectionResult.key).toEqual('magento_ssh');
    expect(adapterCollectionResult.id).toEqual('2Yad2OyWcSrJg3TngkaK8pjHOzi');
});
test('Test get connection configuration', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: CollectionResult<AdapterConnectionConfigurationValue> = await client.getAdapterConnectionEndpoint().getConnectionConfiguration('2Yad2eW1CbgY2ZuoeYsgnZfM0ka');

    const configurationValues: AdapterConnectionConfigurationValue[] = adapterCollectionResult.getData();

    expect(configurationValues.length).toBeGreaterThan(0);

    for (const configurationValue of configurationValues) {
        expect(configurationValue.adapterConnectionId).toEqual('2Yad2eW1CbgY2ZuoeYsgnZfM0ka');
    }
});
test('Test save connection configuration', async () => {
    // expect.assertions(3);

    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const connectionId: string = '2Yad2eW1CbgY2ZuoeYsgnZfM0ka';
    const adapterCollectionResult: CollectionResult<AdapterConnectionConfigurationValue> | null = await client.getAdapterConnectionEndpoint().getConnectionConfiguration(connectionId);

    expect(adapterCollectionResult).not.toBeNull();

    expect(adapterCollectionResult.getData().length).toBeGreaterThan(0);

    const randomUserName: string = 'Username ' + Math.random();

    const config1: AdapterConnectionConfigurationValue | undefined = adapterCollectionResult.getData().find((value: AdapterConnectionConfigurationValue) => value.configurationId === '1');
    if (config1 === undefined) {
        throw new Error('Username not found');
    }

    expect(config1.value).not.toEqual(randomUserName);

    // config1.set('username', randomUserName);

    const newConfiguration: AdapterConnectionConfigurationValue = new AdapterConnectionConfigurationValue();
    newConfiguration.configurationId = '1';
    newConfiguration.adapterConnectionId = connectionId;
    newConfiguration.value = randomUserName;

    await client.getAdapterConnectionEndpoint().saveConnectionConfiguration(connectionId, [newConfiguration]);

    const adapterCollectionResult2: CollectionResult<AdapterConnectionConfigurationValue> = await client.getAdapterConnectionEndpoint().getConnectionConfiguration(connectionId);

    const config12: AdapterConnectionConfigurationValue | undefined = adapterCollectionResult2.getData().find((value: AdapterConnectionConfigurationValue) => value.configurationId === '1');
    if (config12 === undefined) {
        throw new Error('Username not found');
    }

    expect(config12.value).toEqual(randomUserName);
    // const config2: DataValueCollection = AdapterConnectionConfigurationValue.toDataValueCollection(adapterCollectionResult2.getData());
    // expect(config2).not.toBeNull();

    // expect(config2?.get('username')).toEqual(randomUserName);

});
