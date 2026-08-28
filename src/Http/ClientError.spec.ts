import {describe, expect, test} from 'vitest';
import {ClientError} from './ClientError.js';
import {HttpStatus} from './HttpStatus.js';

/**
 * What an unexpected failure tells you is the whole point of these tests.
 *
 * `fromError` used to replace every non-TypeError message with 'Unknown error'. A browser-only
 * `ReferenceError: Buffer is not defined` therefore reached the console, the error page and the
 * logs as "Unknown error" — for every call, with nothing naming the cause. Diagnosing it took a
 * browser session; the message alone would have taken a minute.
 */
describe('ClientError.fromError', () => {

    test('carries the original message instead of replacing it', () => {
        const result: ClientError = ClientError.fromError(new ReferenceError('Buffer is not defined'));

        expect(result.message).toBe('Buffer is not defined');
        expect(result.httpStatus).toBe(HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
    });

    test('keeps the original name and stack, so the shape of the failure survives', () => {
        const original: Error = new ReferenceError('Buffer is not defined');

        const result: ClientError = ClientError.fromError(original);

        expect(result.name).toBe('ReferenceError');
        expect(result.stack).toBe(original.stack);
    });

    test('attaches the original as cause, including where the message is deliberately rewritten', () => {
        // fetch throws TypeError for network failures, and "Service not available" says more to a
        // caller than "Failed to fetch" — so that message IS replaced, and cause is the only way
        // back to the original.
        const original: TypeError = new TypeError('Failed to fetch');

        const result: ClientError = ClientError.fromError(original);

        expect(result.message).toBe('Service not available');
        expect(result.httpStatus).toBe(HttpStatus.HTTP_UNAVAILABLE);
        expect(result.cause).toBe(original);
    });

    test('a ClientError passes through untouched', () => {
        const original: ClientError = new ClientError('Already wrapped', HttpStatus.HTTP_NOTFOUND);

        expect(ClientError.fromError(original)).toBe(original);
    });

    test('an error with no message still says something', () => {
        expect(ClientError.fromError(new Error('')).message).toBe('Unknown error');
    });
});
