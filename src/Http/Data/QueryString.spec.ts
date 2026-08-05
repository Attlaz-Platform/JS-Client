import {Filters} from '../../Model/Pagination/Filters.js';
import {QueryString} from './QueryString.js';

describe('Query String', () => {
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
        // Setting the same parameter twice throws rather than silently keeping one of the values: to
        // send several values for one parameter, pass them as an array (see 'Test collection').
        const queryString: QueryString = new QueryString('https://attlaz.com');
        queryString.set('scopes', 'valueA');

        expect(() => queryString.set('scopes', 'valueB')).toThrow('Param already defined');
        expect(queryString.build()).toBe('https://attlaz.com?scopes=valueA');
    });
    test('Test collection', () => {
        // TODO: should throw error OR override the existing param
        const queryString: QueryString = new QueryString('https://attlaz.com');
        queryString.set('scopes', ['valueA', 'valueB']);
        expect(queryString.build()).toBe('https://attlaz.com?scopes=valueA&scopes=valueB');
    });
    test('Filters - Equal', () => {
        const queryString: QueryString = new QueryString('https://attlaz.com');
        const filters: Filters = new Filters();
        filters.addEqualFilter('member', 'memberId');
        queryString.addFilters(filters);

        expect(queryString.build()).toBe('https://attlaz.com?member=memberId');
    })
    test('Filters - Between', () => {
        const queryString: QueryString = new QueryString('https://attlaz.com');
        const filters: Filters = new Filters();
        filters.addBetweenFilter('price', 17.36, 19.20);
        queryString.addFilters(filters);

        expect(queryString.build()).toBe('https://attlaz.com?price[gte]=17.36&price[lte]=19.2');
    })

})
