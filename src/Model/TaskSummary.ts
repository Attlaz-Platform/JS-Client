import {TaskExecutionStatus} from "./TaskExecutionStatus";

export class TaskSummary {
    public id: string;
    public project: string;
    public command: string;
    public name: string;
    public description: string;
    public direct: boolean = false;

    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;

    //TODO: this doesn't feel right. Separate info/class based on direct or scheduled task?
    public lastExecution: Date;
    public averageExecutionDuration: number;
    public executionCount: number;

    public static parse(rawTask: any): TaskSummary {
        let task: TaskSummary = new TaskSummary();
        task.id = rawTask.id;
        task.project = rawTask.project;
        task.command = rawTask.command;
        task.name = rawTask.name;
        task.description = rawTask.description;
        task.direct = rawTask.direct;

        task.status = TaskExecutionStatus.fromString(rawTask.status);
        task.lastExecution = rawTask.lastExecution;
        task.averageExecutionDuration = rawTask.averageExecutionDuration;
        task.executionCount = rawTask.executionCount;

        return task;
    }
}