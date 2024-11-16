import {Headers} from './Data/Headers.js';
import {ContentTypeHelper} from './ContentTypeHelper.js';

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
        // TODO: content-type or Content-Type or both...?
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
        const parsedContentType: {
            type: string, options: string | null
        } = ContentTypeHelper.formatContentType(contentType);
        return parsedContentType.type;
    }

    public isJson(): boolean {
        return this.getContentType() === 'application/json';
    }
}
