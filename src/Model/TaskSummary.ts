import {TaskExecutionStatus} from "./TaskExecutionStatus";
import {Task} from './Task';
import {ParseHelper} from '../Helper/ParseHelper';

export class TaskSummary extends Task {

    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;
    public lastExecution: Date;
    public averageExecutionDuration: number;
    public executionCount: number;

    public static parse(rawTask: any): TaskSummary {
        let task: TaskSummary = Task.parse(rawTask) as TaskSummary;

        task.status = TaskExecutionStatus.fromString(rawTask.status);
        task.lastExecution = ParseHelper.parseRawDate(rawTask.lastExecution);
        task.averageExecutionDuration = rawTask.averageExecutionDuration;
        task.executionCount = rawTask.executionCount;

        return task;
    }
}
