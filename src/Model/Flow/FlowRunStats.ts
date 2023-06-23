import {Utils} from '../../Utils.js';

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

    public static parse(raw: any): FlowRunStats {
        const flowRunStats: FlowRunStats = new FlowRunStats();
        flowRunStats.flowRunId = raw.flow_run;
        flowRunStats.time = Utils.parseRawDate(raw.time);

        flowRunStats.memory = raw.memory;
        flowRunStats.memoryLimit = raw.memory_limit;

        flowRunStats.cpu = raw.cpu;
        flowRunStats.cpuLimit = raw.cpu_limit;

        flowRunStats.networkOutbound = raw.network_outbound;
        flowRunStats.networkInbound = raw.network_inbound;

        flowRunStats.fileRead = raw.file_read;
        flowRunStats.fileWrite = raw.file_write;

        return flowRunStats;
    }
}
