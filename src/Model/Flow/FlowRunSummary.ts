import {FlowRunStatus} from "./FlowRunStatus";
import {FlowRun} from './FlowRun';
import {Utils} from '../../Utils';

export class FlowRunSummary extends FlowRun {

    public time: Date;
    public runDuration: number;
    public pendingDuration: number;
    public status: FlowRunStatus = FlowRunStatus.Unknown;

    public static parse(rawTaskExecutionSummary: any): FlowRunSummary {
        let taskExecutionSummary: FlowRunSummary = FlowRun.parse(rawTaskExecutionSummary) as FlowRunSummary;

        if (rawTaskExecutionSummary.time === null || rawTaskExecutionSummary.time === undefined) {
            throw new Error('Task execution time cannot be empty')
        }
        taskExecutionSummary.time = Utils.parseRawDate(rawTaskExecutionSummary.time);
        taskExecutionSummary.runDuration = rawTaskExecutionSummary.run_duration;
        taskExecutionSummary.pendingDuration = rawTaskExecutionSummary.pending_duration;
        taskExecutionSummary.status = FlowRunStatus.fromString(rawTaskExecutionSummary.status);

        return taskExecutionSummary;
    }
}
