import {Parameters} from '../Data/Parameters.js';

/**
 * Invoked when an endpoint fails to parse a response object (schema drift). Reporting is
 * non-fatal — parsing still degrades gracefully. Defaults to console.error; set a custom handler
 * (e.g. via Client.setParseErrorHandler) to route these to a logger / error tracker.
 */
export type ParseErrorHandler = (message: string, context: Record<string, unknown>) => void;

export interface ITransport {
    request: <T>(action: string, parameters: Parameters, method: string, signWithOauthToken: boolean) => Promise<T>;

    /** The response bytes, undecoded — for resources a JSON round trip would inflate or destroy. */
    requestBytes: (action: string, parameters: Parameters, method: string, signWithOauthToken: boolean, headers?: Record<string, string>) => Promise<Uint8Array>;

    isDebugEnabled: () => boolean;

    reportParseError: (message: string, context: Record<string, unknown>) => void;

    setParseErrorHandler: (handler: ParseErrorHandler | null) => void;
}
