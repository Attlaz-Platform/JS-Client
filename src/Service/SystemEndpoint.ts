import {Endpoint,TaskExecutionLog,PagedResult,Log} from "..";

export class SystemEndpoint extends Endpoint {

    public getLogs(pageSize: number = 1000, pageNum: number = 0): Promise<PagedResult<Log>> {

        return new Promise<PagedResult<Log>>((resolve, reject) => {

            let cmd: string = '/system/logs/?pageSize=' + pageSize + '&pageNum=' + pageNum + '';

            this.httpClient.request(cmd).then((rawLogs: any) => {

                let logs: Log[] = [];
                for (let rawLog of rawLogs.data) {

                    logs.push(TaskExecutionLog.parse(rawLog));
                }

                let result: PagedResult<Log> = new PagedResult<Log>(logs, rawLogs.pageSize, rawLogs.totalCount);
                resolve(result);

            }).catch((reason) => {
                if(this.httpClient.isDebugEnabled())
                {
                    console.error('Failed to load logs: ', reason);
                }

                reject(reason);
            });

        });
    }
}