import {FlowRunStatus} from './FlowRunStatus';

export class FlowRunHistory {
    public id: number;
    public time: Date;
    public status: FlowRunStatus;

    public static parse(rawTaskExecutionHistory: any): FlowRunHistory {
        let taskExecutionHistory: FlowRunHistory = new FlowRunHistory();
        taskExecutionHistory.id = rawTaskExecutionHistory.id;
        taskExecutionHistory.time = new Date(rawTaskExecutionHistory.time);
        taskExecutionHistory.status = FlowRunStatus.fromString(rawTaskExecutionHistory.status);

        return taskExecutionHistory;
    }
}
