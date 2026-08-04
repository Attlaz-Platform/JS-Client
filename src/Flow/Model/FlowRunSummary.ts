import {Utils} from '../../Utils.js';
import {FlowRunStatus} from './FlowRunStatus.js';
import {FlowRun} from './FlowRun.js';
import {ApiRecord} from '../../Model/ApiRecord.js';

export class FlowRunSummary extends FlowRun {
    public time: Date;
    public runDuration: number;
    public pendingDuration: number;

    public status: FlowRunStatus = FlowRunStatus.Unknown;

    public networkUpload: number | null = null;
    public networkDownload: number | null = null;

    public fileRead: number | null = null;
    public fileWrite: number | null = null;

    public cpuAverage: number | null = null;
    public cpuMaximum: number | null = null;

    public memoryAverage: number | null = null;
    public memoryMaximum: number | null = null;

    public static parse(rawFlowRunSummary: ApiRecord): FlowRunSummary {
        const flowRunSummary: FlowRunSummary = FlowRun.parse(rawFlowRunSummary) as FlowRunSummary;

        flowRunSummary.time = Utils.parseRawDate(rawFlowRunSummary.time as Date);
        flowRunSummary.runDuration = rawFlowRunSummary.run_duration as number;
        flowRunSummary.pendingDuration = rawFlowRunSummary.pending_duration as number;
        flowRunSummary.status = FlowRunStatus.fromString(rawFlowRunSummary.status as string);

        flowRunSummary.networkUpload = rawFlowRunSummary.network_upload as number | null;
        flowRunSummary.networkDownload = rawFlowRunSummary.network_download as number | null;

        flowRunSummary.fileRead = rawFlowRunSummary.file_read as number | null;
        flowRunSummary.fileWrite = rawFlowRunSummary.file_write as number | null;

        flowRunSummary.cpuAverage = rawFlowRunSummary.cpu_average as number | null;
        flowRunSummary.cpuMaximum = rawFlowRunSummary.cpu_maximum as number | null;

        flowRunSummary.memoryAverage = rawFlowRunSummary.memory_average as number | null;
        flowRunSummary.memoryMaximum = rawFlowRunSummary.memory_maximum as number | null;

        return flowRunSummary;
    }
}
