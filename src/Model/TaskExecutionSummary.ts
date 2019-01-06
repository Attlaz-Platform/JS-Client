import {TaskExecutionStatus} from "./TaskExecutionStatus";
import {TaskExecution} from './TaskExecution';

export class TaskExecutionSummary extends TaskExecution {

    public time: Date;
    public duration: number;
    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;
    public arguments: any;

    public static parse(rawTaskExecutionSummary: any): TaskExecutionSummary {
        let taskExecutionSummary: TaskExecutionSummary = TaskExecution.parse(rawTaskExecutionSummary) as TaskExecutionSummary;

        taskExecutionSummary.time = rawTaskExecutionSummary.time;
        taskExecutionSummary.duration = rawTaskExecutionSummary.duration;
        taskExecutionSummary.status = rawTaskExecutionSummary.status;
        taskExecutionSummary.arguments = rawTaskExecutionSummary.arguments;

        return taskExecutionSummary;
    }
}
