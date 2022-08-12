import {Endpoint} from './Endpoint';
import {TaskExecution} from '../Model/TaskExecution';
import {Utils} from '../Utils';
import {TaskExecutionSummary} from '../Model/TaskExecutionSummary';
import {TaskExecutionHistory} from '../Model/TaskExecutionHistory';
import {TaskExecutionStatus} from '../Model/TaskExecutionStatus';
import {ClientError} from '../Model/Error/ClientError';
import {HttpClient} from '../Http/HttpClient';

export class TaskExecutionEndpoint extends Endpoint {

    public getTaskExecutions(taskId: string): Promise<TaskExecution[]> {
        return new Promise<TaskExecution[]>((resolve, reject) => {
            this.httpClient.request('/tasks/' + taskId + '/executions').then((rawTaskExecutions: any[]) => {

                let taskExecutions: TaskExecution[] = [];
                for (let rawTaskExecution of rawTaskExecutions) {
                    taskExecutions.push(TaskExecution.parse(rawTaskExecution));

                }

                resolve(taskExecutions);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks executions: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public async getTaskExecutionSummaries(taskId: string, from: Date | null = null, to: Date | null = null, taskExecutionStatuses: TaskExecutionStatus[] | null = null, projectEnvironmentId: string | null = null): Promise<TaskExecutionSummary[]> {

        try {
            let params: any | null = null;
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

            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                if (params === null || params === undefined) {
                    params = {};
                }
                params.environment = projectEnvironmentId;
            }
            if (taskExecutionStatuses !== null && taskExecutionStatuses.length > 0) {
                if (params === null || params === undefined) {
                    params = {};
                }
                params.statuses = taskExecutionStatuses;
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

    public async getTaskExecutionSummary(taskExecutionId: string): Promise<TaskExecutionSummary | null> {

        try {
            const rawTaskExecution: any = await this.httpClient.request('/taskexecutions/' + taskExecutionId + '/summaries');

            if (rawTaskExecution === null || rawTaskExecution === undefined) {
                return null;
            }
            return TaskExecutionSummary.parse(rawTaskExecution);
        } catch (error: any) {
            if (error instanceof ClientError && error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks executions: ' + error);
            }
            throw error;
        }

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

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load task execution history: ', reason);
                }

                reject(reason);
            });

        });
    }

    public async updateTaskExecution(taskExecutionId: string, status: TaskExecutionStatus, time: Date | null = null): Promise<TaskExecution> {

        if (taskExecutionId.length === 0) {
            throw new Error('Task execution id cannot be empty');
        }

        let params: any = {};

        if (!Utils.isNullOrUndefined(status)) {
            params.status = status;
        }
        if (!Utils.isNullOrUndefined(time)) {
            params.time = time;
        }

        const rawTaskExecution: any = await this.httpClient.request('/taskexecutions/' + taskExecutionId + '', params, 'POST');
        return TaskExecution.parse(rawTaskExecution);

    }
}
