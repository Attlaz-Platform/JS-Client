import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Adapter} from '../Model/Adapter/Adapter.js';
import {AdapterConnection} from '../Model/Adapter/AdapterConnection.js';
import {AdapterConnectionConfigurationValue} from '../Model/Adapter/AdapterConnectionConfigurationValue';
import {DataValueCollection} from '../Model/DataValueCollection';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test get connections', async () => {
    // expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: CollectionResult<Adapter> = await client.getAdapterEndpoint().getAdapters();
});
test('Test get connection', async () => {
    // expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: AdapterConnection | null = await client.getAdapterEndpoint().getConnectionByKey('1dCxPOug1npDYEPY7W719a9CszW', 'magento_ssh');
});
test('Test get connection configuration', async () => {
    // expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: CollectionResult<AdapterConnectionConfigurationValue> = await client.getAdapterEndpoint().getConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif');

    console.log(adapterCollectionResult);
});
test('Test save connection configuration', async () => {
    // expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: CollectionResult<AdapterConnectionConfigurationValue> | null = await client.getAdapterEndpoint().getConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif');


    expect(adapterCollectionResult).not.toBeNull();


    if (adapterCollectionResult !== null) {
        const randomUserName: string = 'Username ' + Math.random();

        const config1: DataValueCollection = AdapterConnectionConfigurationValue.toDataValueCollection(adapterCollectionResult.getData());
        expect(config1.get('username')).not.toEqual(randomUserName);
        config1.set('username', randomUserName);


        await client.getAdapterEndpoint().saveConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif', config1);

        const adapterCollectionResult2: CollectionResult<AdapterConnectionConfigurationValue> = await client.getAdapterEndpoint().getConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif');
        const config2: DataValueCollection = AdapterConnectionConfigurationValue.toDataValueCollection(adapterCollectionResult2.getData());
        expect(config2).not.toBeNull();

        expect(config2?.get('username')).toEqual(randomUserName);
    }

});


