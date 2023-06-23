import {HttpClientRequest} from './HttpClientRequest.js';

test('Test query string', async () => {

    const request: HttpClientRequest = new HttpClientRequest('https://example.com');

    expect(request.getFullUrl()).toBe('https://example.com');

    request.addQueryParam('queryparam1', 'queryparam1value');

    expect(request.getFullUrl()).toBe('https://example.com?queryparam1=queryparam1value');

});
test('Test query string - add to existing query string', async () => {

    const request: HttpClientRequest = new HttpClientRequest('https://example.com?queryparam0=queryparam0value');

    expect(request.getFullUrl()).toBe('https://example.com?queryparam0=queryparam0value');

    request.addQueryParam('queryparam1', 'queryparam1value');

    expect(request.getFullUrl()).toBe('https://example.com?queryparam0=queryparam0value&queryparam1=queryparam1value');

});
