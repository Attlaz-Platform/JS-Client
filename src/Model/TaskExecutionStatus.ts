import {Utils} from '../Utils';

export enum TaskExecutionStatus {
    Unknown = <any>"unknown",
    Pending = <any>"pending",
    Canceled = <any>"canceled",
    Running = <any>"running",
    Failed = <any>"failed",
    Stopped = <any>"stopped",
    Complete = <any>"complete",

}

export namespace TaskExecutionStatus {
    export function fromString(input: string): TaskExecutionStatus {
        const result: TaskExecutionStatus | null = Utils.parseEnum<TaskExecutionStatus>(input, TaskExecutionStatus);
        if (result === null) {
            throw new Error('Unable to parse TaskExecutionStatus from string: Unknown TaskExecutionStatus "' + input + '"');
        }
        return result;
    }
}

