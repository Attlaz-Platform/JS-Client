import {Endpoint} from './Endpoint';
import {FlowRunResponse} from '../Model/Flow/FlowRunResponse';


export class FlowRunRequestEndpoint extends Endpoint {
    public async postTaskExecutionRequest(taskId: string, params: any, wait: boolean = false): Promise<FlowRunResponse> {

        let url: string = '/flows/' + taskId + '/flowrunrequests';
        if (wait) {
            url = url + "?wait=true";
        }

        try {
            // TODO: parse
            const result: any = await this.httpClient.request(url, params, 'POST');
            // console.log('TODO: parse postTaskExecutionRequest result', result);
            return result as FlowRunResponse;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to execute task: ', ex);
            }

            throw ex;
        }

    }
}
