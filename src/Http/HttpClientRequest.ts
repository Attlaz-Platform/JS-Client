import {Utils} from '../Utils';

export class HttpClientRequest {
    public url: string;
    public method: string = 'GET';
    public headers: any = {};
    public omitDefaultHeaders: boolean = true;
    public body: any = null;

    public constructor(url: string, method: string = 'GET') {
        this.url = url;
        this.method = method;
    }

    public setJsonHeader(): void {
        this.setHeader('Content-Type', 'application/json');
    }

    public setBasicAuth(user: string, password: string): void {
        this.setHeader('Authorization', 'Basic ' + Utils.base64encode(user + ':' + password));
    }

    public setHeader(key: string, value: string): void {
        this.headers[key] = value;
    }

    public setJsonBody(data: any): void {
        this.setJsonHeader();
        this.body = JSON.stringify(data);
    }
}
