import {Utils} from '../../Utils.js';

export enum LogStatus {
    Normal = 'normal',
    Ignored = 'ignored',
    Resolved = 'resolved',
}

export namespace LogStatus {

    export function fromString(input: string): LogStatus {
        const result: LogStatus | null = Utils.parseEnum<LogStatus>(input, LogStatus);
        if (result === null) {
            throw new Error('Unable to parse LogStatus from string: Unknown LogStatus "' + input + '"');
        }
        return result;
    }

}
