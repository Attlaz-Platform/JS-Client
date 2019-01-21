import {TaskExecutionStatus} from './TaskExecutionStatus';

export class TaskExecutionHistory {
    public id: number;
    public time: Date;
    public status: TaskExecutionStatus;

    public static parse(rawTaskExecutionHistory: any): TaskExecutionHistory {
        let taskExecutionHistory: TaskExecutionHistory = new TaskExecutionHistory();
        taskExecutionHistory.id = rawTaskExecutionHistory.id;
        taskExecutionHistory.time = new Date(rawTaskExecutionHistory.time);
        taskExecutionHistory.status = TaskExecutionStatus.fromString(rawTaskExecutionHistory.status);

        return taskExecutionHistory;
    }
}
