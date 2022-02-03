import {Endpoint} from './Endpoint';
import {TaskExecutionResponse} from '../Model/TaskExecutionResponse';

export class TaskExecutionRequestEndpoint extends Endpoint {
    public async postTaskExecutionRequest(taskId: string, params: any, wait: boolean = false): Promise<TaskExecutionResponse> {

        let url: string = '/tasks/' + taskId + '/taskexecutionrequests';
        if (wait) {
            url = url + "?wait=true";
        }

        try {
            // TODO: parse
            const result: any = await this.httpClient.request(url, params, 'POST');
            console.log('TODO: parse postTaskExecutionRequest result', result);
            return result as TaskExecutionResponse;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to execute task: ', ex);
            }

            throw ex;
        }

    }
}
