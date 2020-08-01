import {Endpoint, Task, TaskSummary, Utils} from "..";

export class TaskEndpoint extends Endpoint {

    public getTasks(projectId: string): Promise<Task[]> {
        return new Promise<Task[]>((resolve, reject) => {
            this.httpClient.request('projects/' + projectId + '/tasks').then((rawTasks: any[]) => {

                let tasks: Task[] = [];
                for (let rawTask of rawTasks) {
                    tasks.push(Task.parse(rawTask));

                }

                resolve(tasks);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public async getTask(taskId: string): Promise<Task> {

        try {
            const rawTask: any = this.httpClient.request('/tasks/' + taskId);

            if (Utils.isNullOrUndefined(rawTask)) {
                return null;
            }
            return Task.parse(rawTask);

        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks: ' + e);
            }

            throw e;
        }

    }

    public getTaskSummaries(projectId: string, projectEnvironmentId: number = null): Promise<TaskSummary[]> {
        return new Promise<TaskSummary[]>((resolve, reject) => {

            let parameters: any = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            this.httpClient.request('projects/' + projectId + '/tasksummaries', parameters).then((rawTaskSummaries: any[]) => {

                let tasks: TaskSummary[] = [];
                for (let rawTaskSummary of rawTaskSummaries) {
                    tasks.push(TaskSummary.parse(rawTaskSummary));

                }

                resolve(tasks);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public async getTaskSummary(taskId: string, projectEnvironmentId: number = null): Promise<TaskSummary> {

        let parameters: any = null;
        if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
            parameters = {environment: projectEnvironmentId};
        }

        try {
            const rawTaskSummary: any = await this.httpClient.request('tasks/' + taskId + '/summaries', parameters);
            if(Utils.isNullOrUndefined(rawTaskSummary))
            {
                return null;
            }
            return TaskSummary.parse(rawTaskSummary);
        } catch (e) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load task by id ' + taskId + ': ' + e);
            }

            throw e;
        }

    }

    public save(task: Task): Promise<Task> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/projects/' + task.project + '/tasks';

            this.httpClient.request(url, task, 'POST').then((result: any) => {

                resolve(Task.parse(result));

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save task: ', reason);
                }
                reject(reason);
            });

        });
    }
}
