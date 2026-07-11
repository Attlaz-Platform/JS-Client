import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class FlowRunStats {
    public flowRunId: string;

    public time: Date;

    public memory: number | null = null;
    public memoryLimit: number | null = null;

    public cpu: number | null = null;
    public cpuLimit: number | null = null;

    public networkOutbound: number | null = null;
    public networkInbound: number | null = null;

    public fileRead: number | null = null;
    public fileWrite: number | null = null;

    public static parse(raw: ApiRecord): FlowRunStats {
        const flowRunStats: FlowRunStats = new FlowRunStats();
        flowRunStats.flowRunId = raw.flow_run as string;
        flowRunStats.time = Utils.parseRawDate(raw.time as Date);

        flowRunStats.memory = raw.memory as number | null;
        flowRunStats.memoryLimit = raw.memory_limit as number | null;

        flowRunStats.cpu = raw.cpu as number | null;
        flowRunStats.cpuLimit = raw.cpu_limit as number | null;

        flowRunStats.networkOutbound = raw.network_outbound as number | null;
        flowRunStats.networkInbound = raw.network_inbound as number | null;

        flowRunStats.fileRead = raw.file_read as number | null;
        flowRunStats.fileWrite = raw.file_write as number | null;

        return flowRunStats;
    }
}
