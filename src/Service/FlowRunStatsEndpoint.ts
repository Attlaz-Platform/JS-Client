import {Endpoint} from './Endpoint';
import {FlowRunStats} from '../Model/Flow/FlowRunStats';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class FlowRunStatsEndpoint extends Endpoint {
    public async create(flowRunStats: FlowRunStats): Promise<FlowRunStats> {

        let url: string = '/flowruns/' + flowRunStats.flowRunId + '/stats';

        try {

            const parser = (raw: any): FlowRunStats => {
                const flowRunStats: FlowRunStats = new FlowRunStats();
                flowRunStats.flowRunId = raw.flow_run;
                flowRunStats.time = raw.time;

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
            const result: ObjectResult<FlowRunStats> = await this.requestObject(url, flowRunStats, parser, 'POST');

            const createdFlowRunStat: FlowRunStats | null = result.getData();
            if (createdFlowRunStat === null) {
                throw new Error('Unable to create stats: wrong response from API');
            }
            return createdFlowRunStat;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create task execution stats: ', ex);
            }

            throw ex;
        }

    }
}
