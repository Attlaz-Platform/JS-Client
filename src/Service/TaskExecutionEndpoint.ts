import {Endpoint, LogLevel, PagedResult, TaskExecution, TaskExecutionHistory, TaskExecutionLog, TaskExecutionSummary} from "..";

export class TaskExecutionEndpoint extends Endpoint {

    public getLogs(taskExecutionId: string, pageSize: number = 1000, pageNum: number = 0): Promise<PagedResult<TaskExecutionLog>> {

        if (taskExecutionId.length === 0) {
            throw new Error('Task execution id cannot be empty');
        }

        return new Promise<PagedResult<TaskExecutionLog>>((resolve, reject) => {

            let _logs: TaskExecutionLog[] = [];

            let cmd: string = '/taskexecutions/' + taskExecutionId + '/log/?pageSize=' + pageSize + '&pageNum=' + pageNum + '';

            this.httpClient.request(cmd).then((rawTaskExecutionLogs: any) => {

                let taskExecutionLogs: TaskExecutionLog[] = [];
                for (let rawTaskExecutionLog of rawTaskExecutionLogs.data) {
                    taskExecutionLogs.push(TaskExecutionLog.parse(rawTaskExecutionLog));
                }

                _logs = taskExecutionLogs;

                let result: PagedResult<TaskExecutionLog> = new PagedResult<TaskExecutionLog>(_logs, rawTaskExecutionLogs.pageSize, rawTaskExecutionLogs.totalCount);
                resolve(result);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load task execution logs: ', reason);
                }

                reject(reason);
            });

            /**
             *
             */

            // this.socketService.on('log', (rawLog: any) => {
            //
            //
            //     console.log('new log', rawLog);
            //     console.log(_logs.length);
            //
            //     let logs: TaskExecutionLog[] = Object.assign([], _logs);
            //     logs.push(ParseLog.parse(rawLog));
            //
            //
            //     _logs = logs;
            //     subscribe.next(_logs);
            //
            // });

            return () => {
                //TODO: stop listening for "log" events

                //console.log('disconnect');
                // this.socketService.disconnect();

            };
            /**
             *
             */
        });
    }

    public getLogLevelCount(taskExecutionId: string): Promise<Map<LogLevel, number>> {
        if (taskExecutionId.length === 0) {
            throw new Error('Task execution id cannot be empty');
        }

        return new Promise<Map<LogLevel, number>>((resolve, reject) => {

            let cmd: string = '/taskexecutions/' + taskExecutionId + '/loglevelcount';

            this.httpClient.request(cmd).then((rawLogLevelCounts: any) => {

                let logLevelCount: Map<LogLevel, number> = new Map<LogLevel, number>();
                for (let rawLogLevel in rawLogLevelCounts) {

                    let count: number = rawLogLevelCounts[rawLogLevel];

                    let logLevel: LogLevel = LogLevel.fromString(rawLogLevel);

                    logLevelCount.set(logLevel, count);

                }

                resolve(logLevelCount);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load log levels: ', reason);
                }

                reject(reason);
            });

            /**
             *
             */

            // this.socketService.on('log', (rawLog: any) => {
            //
            //
            //     console.log('new log', rawLog);
            //     console.log(_logs.length);
            //
            //     let logs: TaskExecutionLog[] = Object.assign([], _logs);
            //     logs.push(ParseLog.parse(rawLog));
            //
            //
            //     _logs = logs;
            //     subscribe.next(_logs);
            //
            // });

            return () => {
                //TODO: stop listening for "log" events

                //console.log('disconnect');
                // this.socketService.disconnect();

            };
            /**
             *
             */
        });
    }

    public getTaskExecutions(taskId: string): Promise<TaskExecution[]> {
        return new Promise<TaskExecution[]>((resolve, reject) => {
            this.httpClient.request('/tasks/' + taskId + '/executions').then((rawTaskExecutions: any[]) => {

                let taskExecutions: TaskExecution[] = [];
                for (let rawTaskExecution of rawTaskExecutions) {
                    taskExecutions.push(TaskExecution.parse(rawTaskExecution));

                }

                resolve(taskExecutions);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks executions: ' + reason);
                }

                reject(reason);
            });
        });
    }


    public async getTaskExecutionSummaries(taskId: string, from: Date = null, to: Date = null): Promise<TaskExecutionSummary[]> {

        try {
            let params: any = null;
            if (from !== null && from !== undefined) {
                if (params === null || params === undefined) {
                    params = {};
                }
                params.from = from.toISOString();
            }
            if (to !== null && to !== undefined) {
                if (params === null || params === undefined) {
                    params = {};
                }
                params.to = to.toISOString();
            }

            const rawTaskExecutions: any[] = await this.httpClient.request('/tasks/' + taskId + '/executionsummaries', params);

            let taskExecutions: TaskExecutionSummary[] = [];
            for (let rawTaskExecution of rawTaskExecutions) {
                taskExecutions.push(TaskExecutionSummary.parse(rawTaskExecution));

            }

            return taskExecutions;

        } catch (error) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks executions: ' + error);
            }

            throw error;
        }

    }

    public getTaskExecutionSummary(taskId: string, taskExecutionId: string): Promise<TaskExecutionSummary> {
        return new Promise<TaskExecutionSummary>((resolve, reject) => {
            this.httpClient.request('/taskexecutions/' + taskExecutionId + '/summaries').then((rawTaskExecution: any) => {

                resolve(TaskExecutionSummary.parse(rawTaskExecution));

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks executions: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public getTaskExecutionHistory(taskExecutionId: string): Promise<TaskExecutionHistory[]> {

        if (taskExecutionId.length === 0) {
            throw new Error('Task execution id cannot be empty');
        }

        return new Promise<TaskExecutionHistory[]>((resolve, reject) => {

            this.httpClient.request('/taskexecutions/' + taskExecutionId + '/history').then((rawTaskExecutionHistories: any) => {

                let taskExecutionHistories: TaskExecutionHistory[] = [];
                for (let rawTaskExecutionHistory of rawTaskExecutionHistories) {

                    taskExecutionHistories.push(TaskExecutionHistory.parse(rawTaskExecutionHistory));
                }
                resolve(taskExecutionHistories);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load task execution history: ', reason);
                }

                reject(reason);
            });

        });
    }

}
