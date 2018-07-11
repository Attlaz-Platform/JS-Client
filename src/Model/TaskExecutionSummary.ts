import {TaskExecutionStatus} from "./TaskExecutionStatus";

export class TaskExecutionSummary {
    public id: string;
    public time: Date;
    public duration: number;
    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;

    public arguments: any;
    //public logCount: number;
}