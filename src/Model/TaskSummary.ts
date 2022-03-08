import {TaskExecutionStatus} from "./TaskExecutionStatus";
import {Task} from './Task';
import {Utils} from '../Utils';

export class TaskSummary extends Task {

    public status: TaskExecutionStatus = TaskExecutionStatus.Unknown;
    public lastExecution: Date | null = null;
    public averageExecutionDuration: number | null = null;
    public executionCount: number = 0;

    public static parse(rawTask: any): TaskSummary {
        let task: TaskSummary = Task.parse(rawTask) as TaskSummary;

        task.status = TaskExecutionStatus.fromString(rawTask.status);
        if (rawTask.lastExecution !== null && rawTask.lastExecution !== undefined) {
            task.lastExecution = Utils.parseRawDate(rawTask.lastExecution);
        }
        task.averageExecutionDuration = rawTask.averageExecutionDuration;
        task.executionCount = rawTask.executionCount;

        return task;
    }
}
