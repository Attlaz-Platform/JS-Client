import {Endpoint, TaskExecution, TaskExecutionHistory, TaskExecutionStatus, TaskExecutionSummary, Utils} from '..';

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

    public async getTaskExecutionSummaries(taskId: string, from: Date = null, to: Date = null, projectEnvironmentId: number = null): Promise<TaskExecutionSummary[]> {

        try {
            let params: any = null;
            if (!Utils.isNullOrUndefined(from)) {
                if (Utils.isNullOrUndefined(params)) {
                    params = {};
                }
                params.from = from.toISOString();
            }
            if (!Utils.isNullOrUndefined(to)) {
                if (Utils.isNullOrUndefined(params)) {
                    params = {};
                }
                params.to = to.toISOString();
            }

            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                if (Utils.isNullOrUndefined(params)) {
                    params = {};
                }
                params.environment = projectEnvironmentId;
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

    public async getTaskExecutionSummary(taskId: string, taskExecutionId: string): Promise<TaskExecutionSummary> {

        try {
            const rawTaskExecution: any = await this.httpClient.request('/taskexecutions/' + taskExecutionId + '/summaries');

            if (Utils.isNullOrUndefined(rawTaskExecution)) {
                return null;
            }
            return TaskExecutionSummary.parse(rawTaskExecution);
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks executions: ' + e);
            }
            throw e;
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

    public async updateTaskExecution(taskExecutionId: string, status: TaskExecutionStatus, time: Date = null): Promise<TaskExecution> {

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
