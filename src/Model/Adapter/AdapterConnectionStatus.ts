import {Utils} from '../../Utils.js';

export enum AdapterConnectionStatus {
    Unknown = 'unknown',
    Healthy = 'healthy',
    Warning = 'warning',
    Critical = 'critical'
}

export namespace AdapterConnectionStatus {

    export const fromString = (input: string): AdapterConnectionStatus => {
        if (input === 'pass') {
            return AdapterConnectionStatus.Healthy;
        }
        if (input === null || input === 'skip') {
            return AdapterConnectionStatus.Unknown;
        }
        if (input === 'fail') {
            return AdapterConnectionStatus.Critical;
        }

        const result: AdapterConnectionStatus | null = Utils.parseEnum<AdapterConnectionStatus>(input, AdapterConnectionStatus);
        if (result === null) {
            throw new Error('Unable to parse AdapterConnectionStatus from string: Unknown AdapterConnectionStatus "' + input + '"');
        }
        return result;
    }

}
