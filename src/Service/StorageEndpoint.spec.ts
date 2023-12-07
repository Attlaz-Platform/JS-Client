import {readFileSync, writeFileSync} from 'fs';
import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {StorageType} from '../Model/Storage/StorageType.js';
import {StorageItem} from '../Model/Storage/StorageItem.js';

jest.setTimeout((60) * 1000);

const apiEndpoint: string = Helper.getEnvValue('apiEndpoint');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

test('Test Storage Endpoint', async () => {
    // expect.assertions(3);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const storageItem: StorageItem = new StorageItem();
    storageItem.key = 'Some random key';
    storageItem.value = 'Some random value';

    const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem('1bJQR6fjfUeydXt9jpLhMryRjZm', StorageType.Cache, 'default', storageItem);

    expect(savedStorageItem.key).toEqual(storageItem.key);
    expect(savedStorageItem.value).toEqual(storageItem.value);
});
test('Test Storage Endpoint - file', async () => {
    expect.assertions(5);

    const client: Client = new Client(apiEndpoint, clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();

    await client.authenticate();

    const storageItem: StorageItem = new StorageItem();
    storageItem.key = 'client-storage-test-' + Math.random();

    const value: string = readFileSync('deploy-2ZBUljba0j0tKMKimJVe8hnvzAr.zip', {encoding: 'binary'}).toString();
    storageItem.value = value;

    const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem('1bJQR6fjfUeydXt9jpLhMryRjZm', StorageType.Cache, 'default', storageItem);

    expect(savedStorageItem.key).toEqual(storageItem.key);
    expect(savedStorageItem.value).toEqual(storageItem.value);

    const savedValue: StorageItem | null = await client.getStorageEndpoint().getItem('1bJQR6fjfUeydXt9jpLhMryRjZm', StorageType.Cache, 'default', storageItem.key);
    if (savedValue === null) {
        throw new Error('Saved value not found');
    }
    expect(savedValue.value.toString()).toStrictEqual(storageItem.value.toString());
    expect(savedValue.value.toString()).toStrictEqual(value.toString());

    expect(savedValue.value.length).toStrictEqual(value.length);


    writeFileSync('x.zip', savedValue.value, {encoding: 'binary'});


});
