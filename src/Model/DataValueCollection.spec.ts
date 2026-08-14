import {describe, expect, it} from 'vitest';
import {DataValueCollection} from './DataValueCollection.js';

/**
 * `set` overwrites in place. It used to call `splice(index)` without a delete count, which removes
 * everything from that index to the end of the array — so overwriting a key silently dropped every
 * value stored after it. Anything holding more than one value lost data, and nothing complained.
 */
describe('DataValueCollection', () => {

    const collectionOf = (values: Record<string, string>): DataValueCollection => {
        const collection: DataValueCollection = new DataValueCollection();
        for (const [key, value] of Object.entries(values)) {
            collection.set(key, value);
        }

        return collection;
    };

    it('keeps the other values when a key is overwritten', () => {
        const collection: DataValueCollection = collectionOf({first: 'a', second: 'b', third: 'c'});

        collection.set('first', 'changed');

        expect(collection.get('first')).toBe('changed');
        expect(collection.get('second')).toBe('b');
        expect(collection.get('third')).toBe('c');
        expect(collection.length).toBe(3);
    });

    it('overwrites rather than appending a second entry for the same key', () => {
        const collection: DataValueCollection = collectionOf({only: 'a'});

        collection.set('only', 'changed');

        expect(collection.length).toBe(1);
        expect(collection.get('only')).toBe('changed');
    });

    it('keeps the position of an overwritten key', () => {
        const collection: DataValueCollection = collectionOf({first: 'a', second: 'b'});

        collection.set('first', 'changed');

        // `set` removes then pushes, so an overwritten key moves to the end. Pinned because
        // `serialize` writes the array in order and the API stores it that way.
        expect([...collection].map(value => value.key)).toEqual(['second', 'first']);
    });

    it('parses duplicate keys down to the last one without losing the rest', () => {
        const collection: DataValueCollection = DataValueCollection.fromObject([
            {key: 'first', value: 'a'},
            {key: 'second', value: 'b'},
            {key: 'first', value: 'again'},
        ]);

        expect(collection.get('first')).toBe('again');
        expect(collection.get('second')).toBe('b');
        expect(collection.length).toBe(2);
    });

    it('removes only the named key', () => {
        const collection: DataValueCollection = collectionOf({first: 'a', second: 'b', third: 'c'});

        collection.unset('second');

        expect(collection.has('second')).toBe(false);
        expect(collection.get('first')).toBe('a');
        expect(collection.get('third')).toBe('c');
    });
});
