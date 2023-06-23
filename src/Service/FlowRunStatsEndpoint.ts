import {Endpoint} from './Endpoint.js';
import {FlowRunStats} from '../Model/Flow/FlowRunStats.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';

export class FlowRunStatsEndpoint extends Endpoint {
    public async create(flowRunStats: FlowRunStats): Promise<FlowRunStats> {
        const url: string = '/flowruns/' + flowRunStats.flowRunId + '/stats';

        try {
            const result: ObjectResult<FlowRunStats> = await this.requestObject(url, flowRunStats, FlowRunStats.parse, 'POST');

            const createdFlowRunStat: FlowRunStats | null = result.getData();
            if (createdFlowRunStat === null) {
                throw new Error('Unable to create stats: wrong response from API');
            }
            return createdFlowRunStat;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to create flow run stats: ', ex);
            }

            throw ex;
        }
    }
}
