import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {HttpClient} from './HttpClient.js';

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
test('Test request - invalid', async () => {
    const userRequest: HttpClientRequest = new HttpClientRequest('https://www.googleapis.com/userinfo/v2/me', 'GET');
    userRequest.setHeader('Authorization', 'Bearer ya29.a0AeDClZB3KISazE0DfzKPEb88U3pnRtQ4PiJnEZZlv8F7i3uQci37fkfJ9D4iLAn4GIyGT0Mwu84o9Oh6Xh2gFJ6PhfqGUICO9q9KzwTaqXAFE6koZOKDw81-u7sbP24Os5LDVSqTm0vykB_3ETN38uyczn3LAQlQ1x6YaCgYKAbYSARESFQHGX2Mil9ebmkDiSpm0BIHa_XD8lg0171');
    userRequest.setHeader('Accept', 'application/json');
    userRequest.setJsonHeader();


    const userResponse: HttpClientResponse = await HttpClient.request(userRequest);
});
