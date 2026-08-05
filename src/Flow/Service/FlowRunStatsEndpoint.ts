import {path} from '../../Http/Data/Path.js';
import {FlowRunStats} from '../Model/FlowRunStats.js';
import {ObjectResult} from '../../Model/Result/ObjectResult.js';
import {Endpoint} from '../../Service/Endpoint.js';

export class FlowRunStatsEndpoint extends Endpoint {
    public async create(flowRunStats: FlowRunStats): Promise<FlowRunStats> {
        const url: string = path('/flowruns/:flowRunId/stats', {flowRunId: flowRunStats.flowRunId});

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
