import {FlowRun} from '../Model/Flow/FlowRun.js';
import {FlowRunStatus} from '../Model/Flow/FlowRunStatus.js';
import {FlowRunSummary} from '../Model/Flow/FlowRunSummary.js';
import {FlowRunHistory} from '../Model/Flow/FlowRunHistory.js';
import {FlowRunLifecycle} from '../Model/Flow/FlowRunLifecycle.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class FlowRunEndpoint extends Endpoint {
    public async getFlowRuns(flowId: string): Promise<CollectionResult<FlowRun>> {
        const result: CollectionResult<FlowRun> = await this.requestCollection('/flows/' + flowId + '/runs', FlowRun.parse);
        return result;
    }

    public async getFlowRunSummaries(flowId: string, flowRunStatuses: FlowRunStatus[] | null = null, pagination: CursorPagination | null = null, projectEnvironmentId: string | null = null): Promise<CollectionResult<FlowRunSummary>> {
        try {
            const queryString: QueryString = new QueryString('/flows/' + flowId + '/runsummaries');
            queryString.addPagination(pagination);

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

            if (projectEnvironmentId !== null && projectEnvironmentId !== undefined && projectEnvironmentId !== '') {
                queryString.set('environment', projectEnvironmentId);
            }
            if (flowRunStatuses !== null && flowRunStatuses !== undefined && flowRunStatuses.length > 0) {
                queryString.set('statuses', flowRunStatuses.map((status) => status.toString()));
            }
            // if (flowRunStatuses !== null && flowRunStatuses.length > 0) {
            //     if (params === null || params === undefined) {
            //         params = {};
            //     }
            //     params.statuses = flowRunStatuses;
            // }

            const result: CollectionResult<FlowRunSummary> = await this.requestCollection(queryString.build(), FlowRunSummary.parse);

            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load flow runs: ' + error);
            }

            throw error;
        }
    }

    public async getFlowRunSummary(flowRunId: string): Promise<FlowRunSummary | null> {
        try {
            const result: ObjectResult<FlowRunSummary | null> = await this.requestObject('/flowruns/' + flowRunId + '/summaries', null, FlowRunSummary.parse);

            return result.getData();
        } catch (error: any) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load flow runs: ' + error);
            }
            throw error;
        }
    }

    /**
     * Fetch a single flow run by id, including its `arguments` and `logStreamId`. Uses the same
     * endpoint as {@link getFlowRunSummary} but parses the full {@link FlowRun} (the summary model
     * only carries execution stats). Used by the flow-run runtime to resolve the real arguments
     * and the log stream to write to.
     */
    public async getFlowRun(flowRunId: string): Promise<FlowRun | null> {
        try {
            const result: ObjectResult<FlowRun | null> = await this.requestObject('/flowruns/' + flowRunId + '/summaries', null, FlowRun.parse);

            return result.getData();
        } catch (error: any) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load flow run: ' + error);
            }
            throw error;
        }
    }

    public async getFlowRunHistory(flowRunId: string): Promise<CollectionResult<FlowRunHistory>> {
        const result: CollectionResult<FlowRunHistory> = await this.requestCollection('/flowruns/' + flowRunId + '/history', FlowRunHistory.parse);
        return result;
    }

    /**
     * Authoritative lifecycle (status derived from history, first-terminal-wins). Prefer this over
     * getFlowRunSummary for control-flow decisions (e.g. the worker tombstone), since the summary
     * reflects the eventually-consistent index projection which can lag the history.
     */
    public async getFlowRunLifecycle(flowRunId: string): Promise<FlowRunLifecycle | null> {
        const result: ObjectResult<FlowRunLifecycle | null> = await this.requestObject('/flowruns/' + flowRunId + '/lifecycle', null, FlowRunLifecycle.parse);
        return result.getData();
    }

    public async updateFlowRun(flowRunId: string, status: FlowRunStatus, time: Date | null = null): Promise<FlowRun> {
        if (flowRunId.length === 0) {
            throw new Error('Flow run id cannot be empty');
        }

        const params: { status?: FlowRunStatus, time?: Date } = {};

        if (status !== null && status !== undefined) {
            params.status = status;
        }
        if (time !== null && time !== undefined) {
            params.time = time;
        }

        const result: ObjectResult<FlowRun> = await this.requestObject('/flowruns/' + flowRunId + '', params, FlowRun.parse, 'POST');

        const updatedFlowRun: FlowRun | null = result.getData();
        if (updatedFlowRun === null) {
            throw new Error('FlowRun not updated');
        }
        return updatedFlowRun;
    }
}
