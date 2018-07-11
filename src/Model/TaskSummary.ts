import {TaskExecutionStatus} from "./TaskExecutionStatus";

export class TaskSummary {
    public id: string;
    public branch: string;
    public command: string;
    public name: string;
    public description: string;
    public direct: boolean = false;


    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;

    //TODO: this doesn't feel right. Separate info/class based on direct or scheduled task?
    public lastExecution: Date;
    public averageExecutionDuration: number;
    public executionCount: number;
}