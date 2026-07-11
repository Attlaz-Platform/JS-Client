import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';
import {Flow} from './Flow.js';
import {FlowRunStatus} from './FlowRunStatus.js';

export class FlowSummary extends Flow {
    public projectEnvironment: string;
    public status: FlowRunStatus = FlowRunStatus.Unknown;
    public latestRun: Date | null = null;
    public averageRunDuration: number | null = null;
    public averagePendingDuration: number | null = null;
    public runCount: number = 0;

    public static parse(rawFlowSummary: ApiRecord): FlowSummary {
        const flowSummary: FlowSummary = Flow.parse(rawFlowSummary) as FlowSummary;
        flowSummary.projectEnvironment = rawFlowSummary.project_environment as string;
        flowSummary.status = FlowRunStatus.fromString(rawFlowSummary.status as string);
        flowSummary.latestRun = rawFlowSummary.latest_run === null ? null : Utils.parseRawDate(rawFlowSummary.latest_run as Date);
        flowSummary.averageRunDuration = rawFlowSummary.average_run_duration as number;
        flowSummary.averagePendingDuration = rawFlowSummary.average_pending_duration as number;
        flowSummary.runCount = rawFlowSummary.run_count as number;

        return flowSummary;
    }
}
