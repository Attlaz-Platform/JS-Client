import * as process from 'node:process';

export class Helper {
    public static getEnvValue(key: string): string {
        // TODO: maybe we can store this all in a YAML file so it's easier to separate by test
        const value: string | undefined = process.env[key];
        if (value === null || value === undefined || value === '') {
            // console.log(process.env);
            throw new Error('Env value for "' + key + '" not defined');
        }
        return value;
    }

    /**
     * Which server to talk to. Deliberately not which API *version*: this used to take
     * 'local' | 'ngrok' | 'alpha' | 'beta' | 'stable' and resolve each to its own URL, which
     * conflated two independent questions — 'local' answers where, 'beta' answered what version —
     * and modelled versioning as a URL prefix. The API has not been versioned that way for a while:
     * the version travels in the `Attlaz-API-Version` header, which is what the Web App sends
     * (`AttlazService` calls `client.setVersion(...)`). Tests that pinned a version in the URL were
     * exercising a path no first-party client uses. Use {@link getApiVersion} for the version.
     */
    public static getApiEndpoint(target: 'local' | 'live' = 'live'): string {
        return this.getEnvValue(target === 'local' ? 'apiEndpointLocal' : 'apiEndpointLive');
    }

    /**
     * The API version to pin, for `client.setVersion()`. Null — an unset or empty `apiVersion` —
     * means "whatever the gateway serves by default", which is what a test normally wants: pinning
     * a version makes a test start failing when that line is retired, for reasons unrelated to
     * what it covers.
     */
    public static getApiVersion(): string | null {
        const value: string | undefined = process.env.apiVersion;
        return value === undefined || value === '' ? null : value;
    }
}
