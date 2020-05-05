import {TaskExecutionStatus} from "./TaskExecutionStatus";
import {TaskExecution} from './TaskExecution';
import {Utils} from '../Utils';

export class TaskExecutionSummary extends TaskExecution {

    public time: Date;
    public duration: number;
    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;

    public static parse(rawTaskExecutionSummary: any): TaskExecutionSummary {
        let taskExecutionSummary: TaskExecutionSummary = TaskExecution.parse(rawTaskExecutionSummary) as TaskExecutionSummary;

        if (rawTaskExecutionSummary.time !== null && rawTaskExecutionSummary.time !== undefined) {
            taskExecutionSummary.time = Utils.parseRawDate(rawTaskExecutionSummary.time);
        }
        taskExecutionSummary.duration = rawTaskExecutionSummary.duration;
        taskExecutionSummary.status = rawTaskExecutionSummary.status;

        return taskExecutionSummary;
    }
}
