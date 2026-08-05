import {HttpClientRequest} from './HttpClientRequest.js';

test('Test query string', () => {
    const request: HttpClientRequest = new HttpClientRequest('https://example.com');

    expect(request.getFullUrl()).toBe('https://example.com');

    request.addQueryParam('queryparam1', 'queryparam1value');

    expect(request.getFullUrl()).toBe('https://example.com?queryparam1=queryparam1value');
});
test('Test query string - add to existing query string', () => {
    const request: HttpClientRequest = new HttpClientRequest('https://example.com?queryparam0=queryparam0value');

    expect(request.getFullUrl()).toBe('https://example.com?queryparam0=queryparam0value');

    request.addQueryParam('queryparam1', 'queryparam1value');

    expect(request.getFullUrl()).toBe('https://example.com?queryparam0=queryparam0value&queryparam1=queryparam1value');
});
test('Test headers', () => {
    const request: HttpClientRequest = new HttpClientRequest('https://example.com', 'GET');
    request.setHeader('Accept', 'application/json');
    request.setJsonHeader();

    expect(request.headers['Accept']).toBe('application/json');
    expect(request.method).toBe('GET');
});
