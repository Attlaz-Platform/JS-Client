import {Client} from '../Client';
import {Helper} from '../../e2e/src/helper';
import {StorageType} from '../Model/Storage/StorageType';
import {StorageItem} from '../Model/Storage/StorageItem';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test Storage Endpoint', async () => {

    // expect.assertions(3);

    let client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const storageItem: StorageItem = new StorageItem();
    storageItem.key = 'Some random key';
    storageItem.value = 'Some random value';

    const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem('62', StorageType.Cache, 'default', storageItem);

    expect(savedStorageItem.key).toEqual(storageItem.key);
    expect(savedStorageItem.value).toEqual(storageItem.value);
});

