import {Endpoint} from "..";

export class TaskExecutionRequestEndpoint extends Endpoint {
    public postTaskExecutionRequest(taskId: string, params: any, wait: boolean = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/tasks/' + taskId + '/taskexecutionrequests';
            if (wait) {
                url = url + "?wait=true";
            }
            this.httpClient.request(url, params, 'POST').then((result: any) => {

                resolve(result);
            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load config: ', reason);
                }

                reject(reason);
            });

        });
    }
}