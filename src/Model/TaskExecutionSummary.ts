import {TaskExecutionStatus} from "./TaskExecutionStatus";

export class TaskExecutionSummary {
    public id: string;
    public time: Date;
    public duration: number;
    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;

    public arguments: any;

    //public logCount: number;

    public static parse(rawTaskExecutionSummary: any): TaskExecutionSummary {
        let taskExecutionSummary: TaskExecutionSummary = new TaskExecutionSummary();
        taskExecutionSummary.id = rawTaskExecutionSummary.id;
        taskExecutionSummary.time = rawTaskExecutionSummary.time;
        taskExecutionSummary.duration = rawTaskExecutionSummary.duration;
        taskExecutionSummary.status = rawTaskExecutionSummary.status;
        taskExecutionSummary.arguments = rawTaskExecutionSummary.arguments;

        return taskExecutionSummary;
    }
}