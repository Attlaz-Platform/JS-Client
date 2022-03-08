import {Endpoint} from './Endpoint';
import {LogQuery} from '../Model/Log/LogQuery';
import {PagedResult} from '../Model/PagedResult';
import {Log} from '../Model/Log/Log';
import {Utils} from '../Utils';
import {LogStreamId} from '../Model/Log/LogStreamId';
import {LogLevel} from '../Model/Log/LogLevel';
import {DataResult} from '../Model/Result/DataResult';
import {DataValueValue} from '../Model/DataValue';

export class LogEndpoint extends Endpoint {

    public getLogs(logQuery: LogQuery): Promise<PagedResult<Log>> {

        return new Promise<PagedResult<Log>>((resolve, reject) => {

            const arrQuery: string[] = [];
            arrQuery.push('pageSize=' + logQuery.pageSize);
            arrQuery.push('pageNum=' + logQuery.pageNum);

            // Resolved
            if (logQuery.hidden !== null && logQuery.hidden !== undefined) {
                if (logQuery.hidden === true) {
                    arrQuery.push('hidden=1');
                } else {
                    arrQuery.push('hidden=0');
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
                    arrTags.push(tag.key + ':' + tag.values);
                }
                const strTags: string = arrTags.join(',');

                arrQuery.push('tags=' + strTags);
            }

            let cmd: string = '/logstreams/' + Utils.base64encode(logQuery.logStreamId.id) + '/logs/?' + arrQuery.join('&');

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

    public async save(log: Log): Promise<Log> {

        try {
            let cmd: string = '/logstreams/' + Utils.base64encode(log.logStream.id) + '/logs';

            const result: DataResult<Log> = await this.request(cmd, log, 'POST');

            return Log.parse(result.getData());
        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save log: ', error);
            }

            throw error;
        }

    }

    public async delete(logId: string): Promise<boolean> {

        let cmd: string = '/logstreams/:streamId/logs/' + logId;

        try {
            const removed: boolean = await this.httpClient.request(cmd, null, 'DELETE');

            return removed;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save log: ', e);
            }
            throw e;
        }

    }

    public async clear(logStreamId: LogStreamId): Promise<boolean> {
        let cmd: string = '/logstreams/' + Utils.base64encode(logStreamId.id) + '/clear';

        try {
            const removed: boolean = await this.httpClient.request(cmd, null, 'POST');

            return removed;
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save log: ', e);
            }
            throw e;
        }
    }

    public async getInformation(logStreamId: LogStreamId): Promise<{ logLevels: Map<LogLevel, number>, tags: Map<string, (DataValueValue)[]> }> {
        try {
            let url: string = '/logstreams/' + Utils.base64encode(logStreamId.id) + '/info';

            const dataResult: DataResult<{ level_count: {}, tags: {} }> = await this.request(url);
            if (Utils.isNullOrUndefined(dataResult)) {
                throw new Error('Invalid response');
            }

            const data: { level_count: any, tags: any } | null = dataResult.getData();
            if (data === null) {
                throw new Error('Invalid response');
            }
            const rawData: { level_count: any, tags: any } = data;

            const logLevels: Map<LogLevel, number> = new Map<LogLevel, number>();

            Object.keys(rawData.level_count).forEach((logLevelKey: string, index) => {

                const logLevel: LogLevel = LogLevel.fromString(logLevelKey);

                const parsedCount: number | null = parseInt(rawData.level_count[logLevelKey], undefined);
                if (parsedCount !== null) {
                    logLevels.set(logLevel, parsedCount);
                } else {
                    console.error('Unserialize log level count: Unable to parse log level count', rawData.level_count[logLevelKey]);
                }

            });

            const tags: Map<string, DataValueValue[]> = new Map<string, DataValueValue[]>();
            if (rawData.tags !== null && rawData.tags !== undefined) {

                Object.keys(rawData.tags).forEach((tagKey: string, index) => {

                    const values: DataValueValue[] = rawData.tags[tagKey];

                    tags.set(tagKey, values);

                });
            }
            return {logLevels: logLevels, tags};

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load log stream information: ', error);
            }

            throw error;
        }
    }
}
