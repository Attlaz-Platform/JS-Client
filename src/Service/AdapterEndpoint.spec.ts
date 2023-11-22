import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {Adapter} from '../Model/Adapter/Adapter.js';
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
test('Test get connection configuration', async () => {
    // expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: DataValueCollection | null = await client.getAdapterEndpoint().getConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif');

    console.log(adapterCollectionResult);
});
test('Test save connection configuration', async () => {
    // expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const adapterCollectionResult: DataValueCollection | null = await client.getAdapterEndpoint().getConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif');

    expect(adapterCollectionResult).not.toBeNull();


    if (adapterCollectionResult !== null) {
        const randomUserName: string = 'Username ' + Math.random();

        expect(adapterCollectionResult.get('username')).not.toEqual(randomUserName);
        adapterCollectionResult.set('username', randomUserName);


        await client.getAdapterEndpoint().saveConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif', adapterCollectionResult);

        const adapterCollectionResult2: DataValueCollection | null = await client.getAdapterEndpoint().getConnectionConfiguration('2YWwEb5bZ0ajWfhiP1oyqMVXSif');

        expect(adapterCollectionResult2).not.toBeNull();

        expect(adapterCollectionResult2?.get('username')).toEqual(randomUserName);
    }

});
