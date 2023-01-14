import {Endpoint} from './Endpoint';
import {Utils} from '../Utils';
import {ClientError} from '../Model/Error/ClientError';
import {HttpClient} from '../Http/HttpClient';
import {FlowRun} from '../Model/Flow/FlowRun';
import {FlowRunStatus} from '../Model/Flow/FlowRunStatus';
import {FlowRunSummary} from '../Model/Flow/FlowRunSummary';
import {FlowRunHistory} from '../Model/Flow/FlowRunHistory';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class FlowRunEndpoint extends Endpoint {

    public async getFlowRuns(flowId: string): Promise<CollectionResult<FlowRun>> {

        const result: CollectionResult<FlowRun> = await this.requestCollection('/flows/' + flowId + '/runs', null, FlowRun.parse)
        return result;

    }

    public async getFlowRunSummaries(flowId: string, from: Date | null = null, to: Date | null = null, flowRunStatuses: FlowRunStatus[] | null = null, projectEnvironmentId: string | null = null): Promise<FlowRunSummary[]> {

        try {
            let params: any | null = null;
            if (from !== null && from !== undefined) {

                params = {};

                params.from = from.toISOString();
            }
            if (to !== null && to !== undefined) {
                if (params === null || params === undefined) {
                    params = {};
                }
                params.to = to.toISOString();
            }

            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                if (params === null || params === undefined) {
                    params = {};
                }
                params.environment = projectEnvironmentId;
            }
            if (flowRunStatuses !== null && flowRunStatuses.length > 0) {
                if (params === null || params === undefined) {
                    params = {};
                }
                params.statuses = flowRunStatuses;
            }
            const rawTaskExecutions: any[] = await this.httpClient.request('/flows/' + flowId + '/runsummaries', params);

            let taskExecutions: FlowRunSummary[] = [];
            for (let rawTaskExecution of rawTaskExecutions) {
                taskExecutions.push(FlowRunSummary.parse(rawTaskExecution));

            }

            return taskExecutions;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks executions: ' + error);
            }

            throw error;
        }

    }

    public async getTaskExecutionSummary(taskExecutionId: string): Promise<FlowRunSummary | null> {

        try {
            const rawTaskExecution: any = await this.httpClient.request('/taskexecutions/' + taskExecutionId + '/summaries');

            if (rawTaskExecution === null || rawTaskExecution === undefined) {
                return null;
            }
            return FlowRunSummary.parse(rawTaskExecution);
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

    public async updateTaskExecution(taskExecutionId: string, status: FlowRunStatus, time: Date | null = null): Promise<FlowRun> {

        if (taskExecutionId.length === 0) {
            throw new Error('Task execution id cannot be empty');
        }

        let params: any = {};

        if (!Utils.isNullOrUndefined(status)) {
            params.status = status;
        }
        if (!Utils.isNullOrUndefined(time)) {
            params.time = time;
        }

        const rawTaskExecution: any = await this.httpClient.request('/taskexecutions/' + taskExecutionId + '', params, 'POST');
        return FlowRun.parse(rawTaskExecution);

    }
}
