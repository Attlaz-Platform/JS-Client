import {Client} from '../Client.js';
import {Helper} from '../../e2e/src/helper.js';
import {StorageType} from '../Model/Storage/StorageType.js';
import {StorageItem} from '../Model/Storage/StorageItem.js';

// Must exceed the largest per-request budget set below, so that a slow transfer fails with the
// client's own timeout — which names the url and the budget — rather than vitest killing the test
// with no indication of what was slow.
vi.setConfig({testTimeout: 15 * 60 * 1000});

const apiEndpoint: string = Helper.getApiEndpoint('live');
// An access token rather than client credentials: the client-credentials principal has no storage
// access to the environment below (verified - every storage call returns 403 while the same calls
// succeed with this token). Which principals hold which grants is tracked in the access-checks work.
const accessToken: string = Helper.getEnvValue('workingAccessTokenForAuthentication');

// Banglorious / demo / production - the environment the test account is a member of. Storage
// access resolves to workspace membership (EntityAccessService.hasAccessToEnvironment), so an
// environment belonging to anyone else answers 403 on every call, which is what the previously
// hardcoded id did. Change this only together with the credentials below.
const PROJECT_ENVIRONMENT: string = '2UNYtPsKA0qMMnllVo0e4Oc6WZ5';
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

/**
 * `timeoutMs` of 0 disables the client's own request budget. The default is 80s and covers the
 * whole exchange, so a payload large enough to take longer than that to transfer is aborted by the
 * client before the server answers — which is exactly what the 274MB case does on a real network.
 */
const connect = (timeoutMs: number | null = null): Client => {
    const client: Client = new Client(accessToken, {apiEndpoint: apiEndpoint});
    client.setVersion(Helper.getApiVersion());
    if (timeoutMs !== null) {
        client.setTimeout(timeoutMs);
    }
    client.getHttpClient().enableDebug();
    return client;
};

const uniqueKey = (): string => 'client-storage-test-' + Math.random();

test('Test Storage Endpoint', async () => {
    const client: Client = connect();

    const storageItem: StorageItem = new StorageItem();
    storageItem.key = 'Some random key';
    storageItem.value = 'Some random value';

    const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem);

    expect(savedStorageItem.key).toEqual(storageItem.key);
    expect(savedStorageItem.value).toEqual(storageItem.value);
});

/**
 * Both ways of storing a large payload, at both sizes, because they are stored differently and fail
 * differently.
 *
 * A string value is stored as `Buffer.from(value, 'utf8')` (`serialisation: 'plain'`), and UTF-8
 * spends two bytes on every character above U+007F — so binary carried as a latin-1 string is
 * ~1.5x its own size at rest. A `Uint8Array` is stored untouched (`serialisation: 'octet'`) at 1.0x.
 * The same source payload therefore reaches any server-side size limit sooner through the string
 * API, which is exactly what makes running both worthwhile: if one passes and the other fails at
 * the same source size, the limit is about bytes stored rather than bytes sent.
 */
describe('large payloads', () => {

    // The default 80s request budget is not enough to transfer hundreds of megabytes over a real
    // network; the client would abort before the server answered.
    const LARGE_TIMEOUT_MS: number = 10 * 60 * 1000;

    for (const megabytes of [49, 274]) {

        test(megabytes + 'MB survives the string API', async () => {
            const client: Client = connect(LARGE_TIMEOUT_MS);
            const payload: Uint8Array = makeBytes(megabytes * MEGABYTE);
            const value: string = toLatin1(payload);

            const storageItem: StorageItem = new StorageItem();
            storageItem.key = uniqueKey();
            storageItem.value = value;

            const savedStorageItem: StorageItem = await client.getStorageEndpoint().setItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem);
            expect(savedStorageItem.key).toEqual(storageItem.key);

            const savedValue: StorageItem | null = await client.getStorageEndpoint().getItem(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, storageItem.key);
            if (savedValue === null) {
                throw new Error('Saved value not found');
            }
            expect(savedValue.value.length).toStrictEqual(value.length);
            // The assertion that actually proves fidelity. Comparing the two strings only shows they
            // agree as strings; converting back to bytes shows the payload survived. Latin-1 is safe
            // here because every character is <= U+00FF, so there are no unpaired surrogates for the
            // server's utf8 encode to replace with U+FFFD.
            expect(Buffer.from(String(savedValue.value), 'latin1').equals(Buffer.from(payload))).toBe(true);
        });

        test(megabytes + 'MB survives the bytes API', async () => {
            const client: Client = connect(LARGE_TIMEOUT_MS);
            const key: string = uniqueKey();
            const payload: Uint8Array = makeBytes(megabytes * MEGABYTE);

            await client.getStorageEndpoint().setItemBytes(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, key, payload, null, 'application/octet-stream');

            const result: Uint8Array = await client.getStorageEndpoint().getItemBytes(PROJECT_ENVIRONMENT, StorageType.Cache, BUCKET, key);

            expect(result.length).toStrictEqual(payload.length);
            expect(Buffer.from(result).equals(Buffer.from(payload))).toBe(true);
        });
    }
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
        const client: Client = connect();
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
        const client: Client = connect();
        const key: string = uniqueKey();

        expect(await client.getStorageEndpoint().hasItem(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key)).toBe(false);

        await client.getStorageEndpoint().setItemBytes(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key, makeBytes(1024), null, 'application/octet-stream');

        expect(await client.getStorageEndpoint().hasItem(PROJECT_ENVIRONMENT, StorageType.Persistent, BUCKET, key)).toBe(true);
    });
});
