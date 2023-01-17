import {Endpoint} from './Endpoint';
import {FlowRunResponse} from '../Model/Flow/FlowRunResponse';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {Parameters} from '../Http/Data/Parameters';

export class FlowRunRequestEndpoint extends Endpoint {
    public async postFlowRunRequest(taskId: string, params: Parameters, wait: boolean = false): Promise<FlowRunResponse> {

        let url: string = '/flows/' + taskId + '/flowrunrequests';
        if (wait) {
            url = url + "?wait=true";
        }

        try {

            const parser = (raw: any): FlowRunResponse => {

                const flowRunResponse: FlowRunResponse = new FlowRunResponse();
                flowRunResponse.flowRunRequestId = raw.flow_run_request;
                flowRunResponse.result = raw.result;
                flowRunResponse.success = raw.success;
                return flowRunResponse;
            }
            const result: ObjectResult<FlowRunResponse> = await this.requestObject(url, params, parser, 'POST');
            // console.log('TODO: parse postTaskExecutionRequest result', result);

            const postedFlowRunResponse: FlowRunResponse | null = result.getData();
            if (postedFlowRunResponse === null) {
                throw new Error('FlowRunResponse not updated');
            }
            return postedFlowRunResponse;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to execute task: ', ex);
            }

            throw ex;
        }

    }
}
