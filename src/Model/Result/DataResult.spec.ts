import {DataResult} from './DataResult.js';

test('Test parsing', () => {
    expect(DataResult.parse(null)).toBe(null);
});
