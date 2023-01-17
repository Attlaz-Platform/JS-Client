import {FlowRunStatus} from "./FlowRunStatus";
import {Flow} from './Flow';
import {Utils} from '../../Utils';

export class FlowSummary extends Flow {

    public status: FlowRunStatus = FlowRunStatus.Unknown;
    public latestRun: Date | null = null;
    public averageRunDuration: number | null = null;
    public averagePendingDuration: number | null = null;
    public runCount: number = 0;

    public static parse(rawTask: any): FlowSummary {
        let task: FlowSummary = Flow.parse(rawTask) as FlowSummary;
        task.status = FlowRunStatus.fromString(rawTask.status);
        task.latestRun = rawTask.latest_run === null?null:Utils.parseRawDate(rawTask.latest_run);
        task.averageRunDuration = rawTask.average_run_duration;
        task.averagePendingDuration = rawTask.average_pending_duration;
        task.runCount = rawTask.run_count;

        return task;
    }
}
