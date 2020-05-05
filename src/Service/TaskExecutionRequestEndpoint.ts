import {Endpoint} from "..";

export class TaskExecutionRequestEndpoint extends Endpoint {
    public async postTaskExecutionRequest(taskId: string, params: any, wait: boolean = false): Promise<any> {

        let url: string = '/tasks/' + taskId + '/taskexecutionrequests';
        if (wait) {
            url = url + "?wait=true";
        }

        try {
            const result: any = this.httpClient.request(url, params, 'POST');

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to execute task: ', ex);
            }

            throw ex;
        }

    }
}
