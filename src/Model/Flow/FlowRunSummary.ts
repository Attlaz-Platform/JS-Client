import {FlowRunStatus} from './FlowRunStatus.js';
import {FlowRun} from './FlowRun.js';
import {Utils} from '../../Utils.js';

export class FlowRunSummary extends FlowRun {
    public time: Date;
    public runDuration: number;
    public pendingDuration: number;
    public status: FlowRunStatus = FlowRunStatus.Unknown;

    public static parse(rawFlowRunSummary: any): FlowRunSummary {
        const flowRunSummary: FlowRunSummary = FlowRun.parse(rawFlowRunSummary) as FlowRunSummary;

        flowRunSummary.time = Utils.parseRawDate(rawFlowRunSummary.time);
        flowRunSummary.runDuration = rawFlowRunSummary.run_duration;
        flowRunSummary.pendingDuration = rawFlowRunSummary.pending_duration;
        flowRunSummary.status = FlowRunStatus.fromString(rawFlowRunSummary.status);

        return flowRunSummary;
    }
}
