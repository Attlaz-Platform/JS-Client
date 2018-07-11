export class TaskExecutionHistory {
    public id: number;
    public time: Date;
    public status: string;


    public static parse(rawTaskExecutionHistory: any): TaskExecutionHistory {
        let taskExecutionHistory: TaskExecutionHistory = new TaskExecutionHistory();
        taskExecutionHistory.id = rawTaskExecutionHistory.id;
        taskExecutionHistory.time = rawTaskExecutionHistory.time;
        taskExecutionHistory.status = rawTaskExecutionHistory.status;

        return taskExecutionHistory;
    }
}