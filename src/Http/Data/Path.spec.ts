import {path} from './Path.js';

describe('Path', () => {
    test('fills placeholders', () => {
        expect(path('/data-quality/datasets/:datasetId/scans', {datasetId: 'abc123'}))
            .toBe('/data-quality/datasets/abc123/scans');
    });

    test('fills several placeholders', () => {
        expect(path('/a/:first/b/:second', {first: 'one', second: 'two'})).toBe('/a/one/b/two');
    });

    test('accepts a template without placeholders', () => {
        expect(path('/data-quality/datasets')).toBe('/data-quality/datasets');
    });

    test('accepts a number', () => {
        expect(path('/items/:id', {id: 12})).toBe('/items/12');
        // 0 is a value, not an absent one.
        expect(path('/items/:id', {id: 0})).toBe('/items/0');
    });

    // The reason this helper exists: a raw value would otherwise change which endpoint is called.
    test('encodes characters that would change the path', () => {
        expect(path('/x/:id', {id: 'a/../b'})).toBe('/x/a%2F..%2Fb');
        expect(path('/x/:id', {id: 'a?b=1'})).toBe('/x/a%3Fb%3D1');
        expect(path('/x/:id', {id: 'a#b'})).toBe('/x/a%23b');
        expect(path('/x/:id', {id: 'a b'})).toBe('/x/a%20b');
    });

    test('rejects an empty value', () => {
        // Silently building `/x/` would address the collection instead of the item.
        expect(() => path('/x/:id', {id: ''})).toThrow('is empty');
    });

    test('rejects a missing value', () => {
        expect(() => path('/x/:id', {})).toThrow('no value for ":id"');
    });

    test('rejects a value with no placeholder', () => {
        // A typo would otherwise vanish silently.
        expect(() => path('/x/:id', {id: 'a', typo: 'b'})).toThrow('no placeholder for "typo"');
    });
});
