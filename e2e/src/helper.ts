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

    public static getApiEndpoint(version: 'local' | 'ngrok' | 'alpha' | 'beta' | 'stable'): string {
        switch (version) {
            case 'alpha':
                return this.getEnvValue('apiEndpointAlpha');
            case 'beta':
                return this.getEnvValue('apiEndpointBeta');
            case 'stable':
                return this.getEnvValue('apiEndpointStable');
            case 'local':
                return this.getEnvValue('apiEndpointLocal');
            case 'ngrok':
                return this.getEnvValue('apiEndpointNgrok');
            default:
                throw new Error('Unknown endpoint `' + version + '`');
        }

    }
}
