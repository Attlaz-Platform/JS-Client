import {Utils} from '../../Utils.js';

export enum CodeDeployStatus {
    Unknown = 'unknown',
    Pending = 'pending',
    Canceled = 'canceled',
    Running = 'running',
    Failed = 'failed',
    Stopped = 'stopped',
    Complete = 'complete',
}

export namespace CodeDeployStatus {
    export const fromString = (input: string): CodeDeployStatus => {
        const result: CodeDeployStatus | null = Utils.parseEnum<CodeDeployStatus>(input, CodeDeployStatus);
        if (result === null) {
            throw new Error('Unable to parse CodeDeployStatus from string: Unknown CodeDeployStatus "' + input + '"');
        }
        return result;
    }
}
