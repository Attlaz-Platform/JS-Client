import {QueryString} from './QueryString.js';

test('Test basic parameters', () => {
    const queryString: QueryString = new QueryString('https://attlaz.com');
    queryString.set('response_type', 'code');

    expect(queryString.build()).toBe('https://attlaz.com?response_type=code');
});

test('Test basic parameters', () => {
    const queryString: QueryString = new QueryString('https://attlaz.com?someparam=there');
    queryString.set('response_type', 'code');

    expect(queryString.build()).toBe('https://attlaz.com?someparam=there&response_type=code');
});
