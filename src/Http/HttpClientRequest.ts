export class HttpClientRequest {
    public url: string;
    public method: string = 'GET';
    public headers: any = {};
    public omitDefaultHeaders: boolean = true;
    public body: any = null;
    public auth: { user: string, password: string };

    public constructor(url: string, method: string = 'GET') {
        this.url = url;
        this.method = method;
    }

    public setJsonHeader(): void {
        this.headers['Content-Type'] = 'application/json';
    }

    public setBasicAuth(user: string, password: string): void {

        this.auth = {
            user: user,
            password: password,
        }
    }
}
