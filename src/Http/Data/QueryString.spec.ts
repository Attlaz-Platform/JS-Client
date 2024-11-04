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
test('Test params with spaces', () => {
    const queryString: QueryString = new QueryString('https://attlaz.com');
    queryString.set('scopes', 'scopeA scopeB scopeC');

    expect(queryString.build()).toBe('https://attlaz.com?scopes=scopeA%20scopeB%20scopeC');
});
test('Test duplicate parameters', () => {
    // TODO: should throw error OR override the existing param
    const queryString: QueryString = new QueryString('https://attlaz.com');
    queryString.set('scopes', 'valueA');
    queryString.set('scopes', 'valueB');
    expect(queryString.build()).toBe('https://attlaz.com?scopes=scopeA%20scopeB%20scopeC');
});
