import {Utils} from '../../Utils.js';

export enum FlowRunStatus {
    Unknown = 'unknown',
    Pending = 'pending',
    Canceled = 'canceled',
    Running = 'running',
    Failed = 'failed',
    Stopped = 'stopped',
    Complete = 'complete',

}

export namespace FlowRunStatus {
    export const fromString = (input: string): FlowRunStatus => {
        const result: FlowRunStatus | null = Utils.parseEnum<FlowRunStatus>(input, FlowRunStatus);
        if (result === null) {
            throw new Error('Unable to parse FlowRunStatus from string: Unknown FlowRunStatus "' + input + '"');
        }
        return result;
    }
}
