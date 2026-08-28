import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {StorageType} from '../Model/Storage/StorageType.js';
import {StorageItem} from '../Model/Storage/StorageItem.js';

vi.setConfig({testTimeout: 5 * 60 * 1000});

const apiEndpoint: string = Helper.getApiEndpoint('live');
const clientCredentialClientId: string = Helper.getEnvValue('clientCredentialClientId');
const clientCredentialClientSecret: string = Helper.getEnvValue('clientCredentialClientSecret');

const PROJECT_ENVIRONMENT: string = '1bJQR6fjfUeydXt9jpLhMryRjZm';
const BUCKET: string = 'default';

const MEGABYTE: number = 1024 * 1024;

/**
 * Deterministic pseudo-random bytes (xorshift32, fixed seed).
 *
 * Generated rather than read from a file on purpose. These tests used to load
 * `e2e/test-49mb.zip` and `e2e/test-274mb.zip`, which are **gitignored** — so on any machine but
 * the one they were created on the tests did not skip, they failed with ENOENT, and the failure
 * looked like a bug rather than a missing fixture. Generating covers the full 0x00–0xff range
 * (including the bytes a UTF-8 decode mangles), is reproducible when a test fails, and commits
 * nothing.
 */
const makeBytes = (size: number): Uint8Array => {
    const bytes: Uint8Array = new Uint8Array(size);
    for (let i: number = 0; i < size; i += 1) {
        // Plain arithmetic rather than a bitwise PRNG so the file stays within the lint rules.
        // 167 is odd and therefore coprime with 256, so the sequence walks every byte value; the
        // second term shifts the phase each 256 bytes so the payload is not one repeating block.
        // It is patterned rather than random — fine here, because what is under test is whether
        // bytes survive unchanged, not how random they look.
        bytes[i] = (i * 167 + Math.floor(i / 256) * 31 + 13) % 256;
    }
    return bytes;
};

/** Latin-1 maps every byte 0x00–0xff to one character, so this is the string form of the payload. */
const toLatin1 = (bytes: Uint8Array): string => {
    const CHUNK: number = 0x8000;
    let out: string = '';
    for (let i: number = 0; i < bytes.length; i += CHUNK) {
        out += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return out;
};

const connect = async (): Promise<Client> => {
    const client: Client = new Client('', {apiEndpoint: apiEndpoint});
    client.setVersion(Helper.getApiVersion());
    client.setClientCredentials(clientCredentialClientId, clientCredentialClientSecret);
    client.getHttpClient().enableDebug();
    await client.authenticate();
    return client;
};

const uniqueKey = (): string => 'client-storage-test-' + Math.random();

test('Test Storage Endpoint', async () => {
    const client: Client = await connect();

    const storageItem: StorageItem = new StorageItem();
    storageItem.key = 'Some random key';
    storageItem.value = 'Some random value';

    const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem);

    expect(savedStorageItem.key).toEqual(storageItem.key);
    expect(savedStorageItem.value).toEqual(storageItem.value);
});

test('Test Storage Endpoint - file', async () => {
    expect.assertions(5);

    const client: Client = await connect();

    const payload: Uint8Array = makeBytes(49 * MEGABYTE);
    const value: string = toLatin1(payload);

    const storageItem: StorageItem = new StorageItem();
    storageItem.key = uniqueKey();
    storageItem.value = value;

    const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem);

    expect(savedStorageItem.key).toEqual(storageItem.key);
    expect(savedStorageItem.value).toEqual(storageItem.value);

    const savedValue: StorageItem | null = await client.getStorageEndpoint().getItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem.key);
    if (savedValue === null) {
        throw new Error('Saved value not found');
    }
    expect(savedValue.value.toString()).toStrictEqual(storageItem.value.toString());
    expect(savedValue.value.length).toStrictEqual(value.length);
    // The assertion that actually proves fidelity. Comparing the two strings only shows they agree
    // as strings; converting back to bytes shows the payload survived. Latin-1 is safe here because
    // every character is <= U+00FF, so there are no unpaired surrogates for the server's utf8
    // encode (`serialisation: 'plain'`) to replace with U+FFFD.
    expect(Buffer.from(String(savedValue.value), 'latin1').equals(Buffer.from(payload))).toBe(true);
});

test('Test Storage Endpoint - big file', async () => {
    expect.assertions(5);

    const client: Client = await connect();

    const payload: Uint8Array = makeBytes(274 * MEGABYTE);
    const value: string = toLatin1(payload);

    const storageItem: StorageItem = new StorageItem();
    storageItem.key = uniqueKey();
    storageItem.value = value;

    const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem);

    expect(savedStorageItem.key).toEqual(storageItem.key);
    expect(savedStorageItem.value).toEqual(storageItem.value);

    const savedValue: StorageItem | null = await client.getStorageEndpoint().getItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem.key);
    if (savedValue === null) {
        throw new Error('Saved value not found');
    }
    expect(savedValue.value.toString()).toStrictEqual(storageItem.value.toString());
    expect(savedValue.value.length).toStrictEqual(value.length);
    // The assertion that actually proves fidelity. Comparing the two strings only shows they agree
    // as strings; converting back to bytes shows the payload survived. Latin-1 is safe here because
    // every character is <= U+00FF, so there are no unpaired surrogates for the server's utf8
    // encode (`serialisation: 'plain'`) to replace with U+FFFD.
    expect(Buffer.from(String(savedValue.value), 'latin1').equals(Buffer.from(payload))).toBe(true);
});

/**
 * The bytes API is what production uses — `VendorImageStore` stores every Market Pulse product
 * image through it — and until now nothing exercised it against a live API. `BinaryRoundTrip.spec`
 * covers the transport against a loopback server, which is not the same thing: it cannot catch the
 * API storing or serving the bytes wrong.
 *
 * Byte equality is asserted directly rather than through a string. The string tests above compare
 * two latin-1 strings, which can agree while the underlying bytes differ.
 */
describe('raw bytes', () => {

    test('round-trip through storage leaves every byte unchanged', async () => {
        const client: Client = await connect();
        const key: string = uniqueKey();
        const payload: Uint8Array = makeBytes(4 * MEGABYTE);

        await client.getStorageEndpoint().setItemBytes(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key, payload, null, 'application/octet-stream');

        const result: Uint8Array = await client.getStorageEndpoint().getItemBytes(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key);

        expect(result.length).toStrictEqual(payload.length);
        // Compared as a whole rather than byte-by-byte in a loop: a failing loop reports only the
        // first differing index, which says nothing about whether one byte or the whole tail is wrong.
        expect(Buffer.from(result).equals(Buffer.from(payload))).toBe(true);
    });

    test('a stored item is reported as existing without transferring it', async () => {
        const client: Client = await connect();
        const key: string = uniqueKey();

        expect(await client.getStorageEndpoint().hasItem(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key)).toBe(false);

        await client.getStorageEndpoint().setItemBytes(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key, makeBytes(1024), null, 'application/octet-stream');

        expect(await client.getStorageEndpoint().hasItem(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key)).toBe(true);
    });
});
