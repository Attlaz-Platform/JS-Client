import {Utils} from '../../Utils.js';

export enum FlowRunStatus {
    Unknown = <any>"unknown",
    Pending = <any>"pending",
    Canceled = <any>"canceled",
    Running = <any>"running",
    Failed = <any>"failed",
    Stopped = <any>"stopped",
    Complete = <any>"complete",

}

export namespace FlowRunStatus {
    export function fromString(input: string): FlowRunStatus {
        const result: FlowRunStatus | null = Utils.parseEnum<FlowRunStatus>(input, FlowRunStatus);
        if (result === null) {
            throw new Error('Unable to parse FlowRunStatus from string: Unknown FlowRunStatus "' + input + '"');
        }
        return result;
    }
}

