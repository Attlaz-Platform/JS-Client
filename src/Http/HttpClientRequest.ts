import {Utils} from '../Utils.js';
import {JsonSerializable} from '../Model/JsonSerializable.js';
import {Headers} from './Data/Headers.js';

export class HttpClientRequest {
    static readonly GET: string = 'GET';
    static readonly POST: string = 'POST';
    static readonly PUT: string = 'PUT';

    public method: string;
    public headers: Headers = {};
    public body: any = null;

    private urlObj: URL;

    public constructor(url: string, method: string = HttpClientRequest.GET) {
        this.urlObj = new URL(url);
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

    public addQueryParam(key: string, value: string | number): void {
        this.urlObj.searchParams.append(key, value.toString());
    }

    public setJsonBody(data: any): void {
        this.setJsonHeader();
        this.body = JsonSerializable.stringify(data);
    }

    public getFullUrl(): string {
        let result: string = this.urlObj.href;
        // Remove trailing slash
        result = result.replace(/\/$/, '');
        // Remove slash in query
        result = result.replace('/?', '?');
        return result;
    }
}
