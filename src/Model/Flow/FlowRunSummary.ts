import {FlowRunStatus} from './FlowRunStatus.js';
import {FlowRun} from './FlowRun.js';
import {Utils} from '../../Utils.js';

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


    public static parse(rawFlowRunSummary: any): FlowRunSummary {
        const flowRunSummary: FlowRunSummary = FlowRun.parse(rawFlowRunSummary) as FlowRunSummary;

        flowRunSummary.time = Utils.parseRawDate(rawFlowRunSummary.time);
        flowRunSummary.runDuration = rawFlowRunSummary.run_duration;
        flowRunSummary.pendingDuration = rawFlowRunSummary.pending_duration;
        flowRunSummary.status = FlowRunStatus.fromString(rawFlowRunSummary.status);

        flowRunSummary.networkUpload = rawFlowRunSummary.network_upload;
        flowRunSummary.networkDownload = rawFlowRunSummary.network_download;

        flowRunSummary.fileRead = rawFlowRunSummary.file_read;
        flowRunSummary.fileWrite = rawFlowRunSummary.file_write;

        flowRunSummary.cpuAverage = rawFlowRunSummary.cpu_average;
        flowRunSummary.cpuMaximum = rawFlowRunSummary.cpu_maximum;

        flowRunSummary.memoryAverage = rawFlowRunSummary.memory_average;
        flowRunSummary.memoryMaximum = rawFlowRunSummary.memory_maximum;

        return flowRunSummary;
    }
}
