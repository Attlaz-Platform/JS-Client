import {Endpoint, Log, PagedResult} from "..";
import {LogQuery} from '../Model/Log/LogQuery';

export class LogEndpoint extends Endpoint {

    public getLogs(logQuery: LogQuery): Promise<PagedResult<Log>> {

        return new Promise<PagedResult<Log>>((resolve, reject) => {

            const arrQuery: string[] = [];
            arrQuery.push('pageSize=' + logQuery.pageSize);
            arrQuery.push('pageNum=' + logQuery.pageNum);

            // Resolved
            if (logQuery.resolved !== null && logQuery.resolved !== undefined) {
                if (logQuery.resolved === true) {
                    arrQuery.push('resolved=1');
                } else {
                    arrQuery.push('resolved=0');
                }
            }

            // LogLevels
            if (logQuery.logLevels !== null && logQuery.logLevels !== undefined && logQuery.logLevels.length > 0) {
                arrQuery.push('logLevels=' + logQuery.logLevels.join(','));
            }
            // Tags
            if (logQuery.tags !== null && logQuery.tags !== undefined && logQuery.tags.length > 0) {

                const arrTags: string[] = [];

                //TODO: map this
                for (const tag of logQuery.tags) {
                    arrTags.push(tag.key + ':' + tag.value);
                }
                const strTags: string = arrTags.join(',');

                arrQuery.push('tags=' + strTags);
            }

            let cmd: string = '/system/logs/?' + arrQuery.join('&');

            this.httpClient.request(cmd).then((rawLogs: any) => {

                let logs: Log[] = [];
                for (let rawLog of rawLogs.data) {

                    logs.push(Log.parse(rawLog));
                }

                let result: PagedResult<Log> = new PagedResult<Log>(logs, rawLogs.pageSize, rawLogs.totalCount);
                resolve(result);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load logs: ', reason);
                }

                reject(reason);
            });

        });
    }

    public save(log: Log): Promise<Log> {

        return new Promise<Log>((resolve, reject) => {

            let cmd: string = '/system/logs/';

            this.httpClient.request(cmd, log, 'POST').then((rawSavedLog: any) => {

                resolve(Log.parse(rawSavedLog));

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save log: ', reason);
                }

                reject(reason);
            });

        });
    }
}
