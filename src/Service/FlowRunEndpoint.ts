import {Endpoint} from './Endpoint';
import {Utils} from '../Utils';
import {ClientError} from '../Model/Error/ClientError';
import {HttpClient} from '../Http/HttpClient';
import {FlowRun} from '../Model/Flow/FlowRun';
import {FlowRunStatus} from '../Model/Flow/FlowRunStatus';
import {FlowRunSummary} from '../Model/Flow/FlowRunSummary';
import {FlowRunHistory} from '../Model/Flow/FlowRunHistory';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {Parameters} from '../Http/Data/Parameters';

export class FlowRunEndpoint extends Endpoint {

    public async getFlowRuns(flowId: string): Promise<CollectionResult<FlowRun>> {

        const result: CollectionResult<FlowRun> = await this.requestCollection('/flows/' + flowId + '/runs', null, FlowRun.parse)
        return result;

    }

    public async getFlowRunSummaries(flowId: string, from: Date | null = null, to: Date | null = null, flowRunStatuses: FlowRunStatus[] | null = null, projectEnvironmentId: string | null = null): Promise<CollectionResult<FlowRunSummary>> {

        try {
            let params: Parameters = null;
            // if (from !== null && from !== undefined) {
            //
            //     params = {};
            //
            //     params.from = from.toISOString();
            // }
            // if (to !== null && to !== undefined) {
            //     if (params === null || params === undefined) {
            //         params = {};
            //     }
            //     params.to = to.toISOString();
            // }

            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                params = {project_environment: projectEnvironmentId};
            }
            // if (flowRunStatuses !== null && flowRunStatuses.length > 0) {
            //     if (params === null || params === undefined) {
            //         params = {};
            //     }
            //     params.statuses = flowRunStatuses;
            // }
            const result: CollectionResult<FlowRunSummary> = await this.requestCollection('/flows/' + flowId + '/runsummaries', params, FlowRunSummary.parse);

            return result;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks executions: ' + error);
            }

            throw error;
        }

    }

    public async getFlowRunSummary(flowRunId: string): Promise<FlowRunSummary | null> {

        try {
            const result: ObjectResult<FlowRunSummary | null> = await this.requestObject('/flowruns/' + flowRunId + '/summaries', null, FlowRunSummary.parse);

            return result.getData();
        } catch (error: any) {
            if (error instanceof ClientError && error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks executions: ' + error);
            }
            throw error;
        }

    }

    public async getFlowRunHistory(flowRunId: string): Promise<CollectionResult<FlowRunHistory>> {

        const result: CollectionResult<FlowRunHistory> = await this.requestCollection('/flowruns/' + flowRunId + '/history', null, FlowRunHistory.parse)
        return result;

    }

    public async updateFlowRun(taskExecutionId: string, status: FlowRunStatus, time: Date | null = null): Promise<FlowRun> {

        if (taskExecutionId.length === 0) {
            throw new Error('Task execution id cannot be empty');
        }

        let params: { status?: FlowRunStatus, time?: Date } = {};

        if (status !== null && status !== undefined) {
            params.status = status;
        }
        if (time !== null && time !== undefined) {
            params.time = time;
        }

        const result: ObjectResult<FlowRun> = await this.requestObject('/flowruns/' + taskExecutionId + '', params, FlowRun.parse, 'POST');

        const updatedFlowRun: FlowRun | null = result.getData();
        if (updatedFlowRun === null) {
            throw new Error('FlowRun not updated');
        }
        return updatedFlowRun;

    }
}
