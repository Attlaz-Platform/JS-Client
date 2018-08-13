import {isNullOrUndefined} from "util";

export enum TaskExecutionStatus {
    Unknown = <any>"unknown",
    Scheduled = <any>"scheduled",
    Canceled = <any>"canceled",
    Running = <any>"running",
    Failed = <any>"failed",
    Stopped = <any>"stopped",
    Complete = <any>"complete",

}

export namespace TaskExecutionStatus {

    export function fromString(taskExecutionStatus: string): TaskExecutionStatus {
        let result: TaskExecutionStatus;
        if (isNullOrUndefined(taskExecutionStatus)) {
            throw new Error('Unable to parse logLevel from string: logLevel not defined');
        }
        switch (taskExecutionStatus.toLowerCase()) {
            case 'unknown':
                result = TaskExecutionStatus.Unknown;
                break;
            case 'scheduled':
                result = TaskExecutionStatus.Scheduled;
                break;
            case 'canceled':
                result = TaskExecutionStatus.Canceled;
                break;
            case 'running':
                result = TaskExecutionStatus.Running;
                break;
            case 'failed':
                result = TaskExecutionStatus.Failed;
                break;
            case 'stopped':
                result = TaskExecutionStatus.Stopped;
                break;
            case 'complete':
                result = TaskExecutionStatus.Complete;
                break;

            default:
                throw new Error('Unknown task execution status "' + taskExecutionStatus + '"');
        }

        return result;
    }

}

