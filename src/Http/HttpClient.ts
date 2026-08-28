import {HttpClientRequest} from './HttpClientRequest.js';
import {HttpClientResponse} from './HttpClientResponse.js';
import {ClientError} from './ClientError.js';

export class HttpClient {

    /**
     * Overall budget for one request, in milliseconds. Matches the Stripe SDKs (80s), which is
     * generous enough for a large payload and bounded enough that an unresponsive API surfaces as an
     * error instead of hanging the caller. `fetch` applies no timeout of its own in the browser, and
     * only bounds response headers in Node.
     */
    public static readonly DEFAULT_TIMEOUT_MS: number = 80_000;

    public static async request(request: HttpClientRequest, timeoutMs: number = HttpClient.DEFAULT_TIMEOUT_MS): Promise<HttpClientResponse> {
        const init: RequestInit = {
            method: request.method,
            headers: request.headers as Record<string, string>,
        };
        if (timeoutMs > 0) {
            init.signal = AbortSignal.timeout(timeoutMs);
        }
        // Node's fetch (undici) throws TypeError when GET/HEAD carry a body. Axios used to silently drop it,
        // so callers may still set body on GET — skip it here instead of propagating a confusing network error.
        const method: string = request.method.toUpperCase();
        if (request.body !== null && request.body !== undefined && method !== 'GET' && method !== 'HEAD') {
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
                        data: JSON.parse(await rawResponse.text()),
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

            // Bytes, never an interpretation. The caller already knows what it asked for — an
            // endpoint supplies a parser, a blob read wants the bytes — so sniffing the content type
            // here would be a second, weaker answer to a question already answered. It was also
            // lossy: the old `text()` fallback UTF-8-decoded binary, turning 10 bytes into 16.
            //
            // Uint8Array, not Buffer: this runs in the browser too, where Buffer does not exist.
            httpResponse.body = new Uint8Array(await rawResponse.arrayBuffer());

            return httpResponse;
        } catch (error: unknown) {
            if (error instanceof ClientError) {
                throw error;
            }
            // AbortSignal.timeout rejects with a TimeoutError DOMException, whose message ("The
            // operation was aborted due to timeout") says nothing about what was being called. Name
            // the url and the budget instead.
            //
            // Matched on `name` rather than `instanceof`: a DOMException raised in another realm — a
            // test runner's VM context, an iframe — is not an instance of this realm's Error, so an
            // instanceof check passes locally and quietly fails everywhere else.
            if (typeof error === 'object' && error !== null && (error as {name?: unknown}).name === 'TimeoutError') {
                throw new ClientError('Request to `' + request.getFullUrl() + '` timed out after ' + timeoutMs + 'ms');
            }
            throw ClientError.fromError(error as Error);
        }
    }
}
