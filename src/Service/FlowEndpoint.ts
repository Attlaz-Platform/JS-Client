import {Endpoint} from './Endpoint.js';
import {Utils} from '../Utils.js';
import {HttpClient} from '../Http/HttpClient.js';
import {Flow} from '../Model/Flow/Flow.js';
import {FlowSummary} from '../Model/Flow/FlowSummary.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {Parameters} from '../Http/Data/Parameters.js';

export class FlowEndpoint extends Endpoint {
    public async getByProject(projectId: string): Promise<CollectionResult<Flow>> {
        try {
            const url: string = '/projects/' + projectId + '/flows';
            const result: CollectionResult<Flow> = await this.requestCollection(url, Flow.parse);
            return result;
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to get projects: ', error);
            }
            throw error;
        }
    }

    public async getById(flowId: string): Promise<Flow | null> {
        try {
            const result: ObjectResult<Flow> = await this.requestObject('/flows/' + flowId, null, Flow.parse);

            return result.getData();
        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load flows: ' + error);
            }

            throw error;
        }
    }

    public async getFlowSummaries(projectId: string, projectEnvironmentId: string | null = null): Promise<CollectionResult<FlowSummary>> {
        let parameters: Parameters = null;
        if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
            parameters = {environment: projectEnvironmentId};
        }
        const result: CollectionResult<FlowSummary> = await this.requestCollection('projects/' + projectId + '/flowsummaries', FlowSummary.parse, parameters);
        return result;
        //
        //     }).catch((reason: any) => {
        //         if (this.httpClient.isDebugEnabled()) {
        //             console.error('Failed to load flow summaries: ' + reason);
        //         }
        //
        //         reject(reason);
        //     });
        // });
    }

    public async getFlowSummary(flowId: string, projectEnvironmentId: string | null = null): Promise<FlowSummary | null> {
        let parameters: Parameters = null;
        if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
            parameters = {environment: projectEnvironmentId};
        }

        try {
            const rawFlowSummaries: ObjectResult<FlowSummary> = await this.requestObject('flows/' + flowId + '/summaries', parameters, FlowSummary.parse);
            if (rawFlowSummaries.getData() === null) {
                return null;
            }
            return rawFlowSummaries.getData();
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load flow by id ' + flowId + ': ' + e);
            }

            throw e;
        }
    }

    public async save(flow: Flow): Promise<Flow> {
        try {
            const url: string = '/projects/' + flow.projectId + '/flows';
            const result: ObjectResult<Flow> = await this.requestObject(url, flow, Flow.parse, 'POST');
            const updatedFlow: Flow | null = result.getData();
            if (updatedFlow === null) {
                throw new Error('Flow not updated');
            }
            return updatedFlow;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save flow: ', e);
            }
            throw e;
        }
    }
}
