import {Headers} from './Data/Header.js';
import {HttpClient} from './HttpClient.js';

export class HttpClientResponse {
    public status: number;
    public statusText: string;
    public body: any | null = null;
    public headers: Headers = {};

    public constructor(status: number, statusText: string) {
        this.status = status;
        this.statusText = statusText;
    }

    public getContentType(): string | null {
        let contentType: string | string[] | null | undefined = this.headers['content-type'];


        if (contentType === null || contentType === undefined) {
            return null;
        }
        if (Array.isArray(contentType)) {
            [contentType] = contentType;
        }
        if (contentType === null || contentType === undefined) {
            return null;
        }
        const parsedContentType: { type: string, options: string | null } = HttpClient.formatContentType(contentType);
        return parsedContentType.type;


    }
}
