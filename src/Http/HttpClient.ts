import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {ClientError} from './ClientError.js';

export class HttpClient {

    public static async request(request: HttpClientRequest): Promise<HttpClientResponse> {
        const init: RequestInit = {
            method: request.method,
            headers: request.headers as Record<string, string>,
        };
        if (request.body !== null && request.body !== undefined) {
            init.body = request.body;
        }

        try {
            const rawResponse: Response = await fetch(request.getFullUrl(), init);

            if (!rawResponse.ok) {
                const statusText: string = rawResponse.statusText || 'Unknown error';
                const clientError: ClientError = ClientError.byStatus(rawResponse.status, statusText)
                    ?? new ClientError(statusText, rawResponse.status);

                // Try to attach the response body for downstream error handling
                try {
                    clientError.response = {
                        status: rawResponse.status,
                        statusText,
                        data: await rawResponse.json(),
                    };
                } catch {
                    // Response body is not JSON — leave response as-is
                }

                throw clientError;
            }

            const httpResponse: HttpClientResponse = new HttpClientResponse(rawResponse.status, rawResponse.statusText);

            rawResponse.headers.forEach((value: string, header: string) => {
                httpResponse.headers[header] = value;
            });

            const contentType: string | null = rawResponse.headers.get('content-type');
            if (contentType !== null && contentType.includes('application/json')) {
                httpResponse.body = await rawResponse.json();
            } else {
                httpResponse.body = await rawResponse.text();
            }

            return httpResponse;
        } catch (error: unknown) {
            if (error instanceof ClientError) {
                throw error;
            }
            throw ClientError.fromError(error as Error);
        }
    }
}
