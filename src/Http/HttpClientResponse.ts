import {Headers} from './Data/Header.js';

export class HttpClientResponse {
    public status: number;
    public statusText: string;
    public body: any | null = null;
    public headers: Headers = {};

    public constructor(status: number, statusText: string) {
        this.status = status;
        this.statusText = statusText;
    }
}
