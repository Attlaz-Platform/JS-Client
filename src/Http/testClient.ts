/**
 * npm run build && node dist/Http/testClient.js
 */
import {HttpClient} from './HttpClient';
import {HttpClientRequest} from './HttpClientRequest';

function request() {

    const endpoint: string = 'http://hq.attlaz.com:32769/api';
    const method: string = 'get';
    const action: string = 'queues/%2F/vijgeblad_production';
    const parameters: any = [];
    const requestData: HttpClientRequest = new HttpClientRequest(endpoint + '/' + action, method);
    requestData.setJsonHeader();
    requestData.setBasicAuth('attlaz', '4$0x51eIaF9w');
    requestData.body = JSON.stringify(parameters);

    HttpClient.request(requestData).then((result: any) => {
        // console.log(result);
        console.log('OK');
    }).catch((error) => {
        console.error(error);
    })
}

request();
