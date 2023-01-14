import {Endpoint} from './Endpoint';
import {FlowRunStats} from '../Model/Flow/FlowRunStats';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class FlowRunStatsEndpoint extends Endpoint {
    public async create(flowRunStats: FlowRunStats): Promise<FlowRunStats> {

        let url: string = '/flowruns/' + flowRunStats.flowRunId + '/stats';

        try {

            const parser = (raw: any): FlowRunStats => {
                return new FlowRunStats();
            }
            const result: ObjectResult<FlowRunStats> = await this.requestObject(url, flowRunStats, parser, 'POST');

            const createdFlowRunStat: FlowRunStats | null = result.getData();
            if (createdFlowRunStat === null) {
                throw new Error('FlowRunStats not created');
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
