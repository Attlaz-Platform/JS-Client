import {HttpClientRequest} from './HttpClientRequest';

test('Test query string', async () => {

    const request: HttpClientRequest = new HttpClientRequest('http://example.com');

    expect(request.getFullUrl()).toBe('http://example.com');

    request.addQueryParam('queryparam1', 'queryparam1value');

    expect(request.getFullUrl()).toBe('http://example.com?queryparam1=queryparam1value');

});
test('Test query string - add to existing query string', async () => {

    const request: HttpClientRequest = new HttpClientRequest('http://example.com?queryparam0=queryparam0value');

    expect(request.getFullUrl()).toBe('http://example.com?queryparam0=queryparam0value');

    request.addQueryParam('queryparam1', 'queryparam1value');

    expect(request.getFullUrl()).toBe('http://example.com?queryparam0=queryparam0value&queryparam1=queryparam1value');

});
