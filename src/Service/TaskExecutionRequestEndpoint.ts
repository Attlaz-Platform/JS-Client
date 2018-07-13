import {Endpoint} from "..";

export class TaskExecutionRequestEndpoint extends Endpoint {
    public postTaskExecutionRequest(params: any, wait: boolean = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/branch/' + this.httpClient.getBranchId() + '/taskexecutionrequest';
            if (wait) {
                url = url + "?wait=true";
            }
            this.httpClient.request(url, params, 'POST').then((result: any) => {

                resolve(result);
            }).catch((reason) => {
                if(this.httpClient.isDebugEnabled())
                {
                    console.error('Failed to load config: ', reason);
                }

                reject(reason);
            });

        });
    }
}