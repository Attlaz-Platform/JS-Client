import {Endpoint} from './Endpoint';
import {Task} from '../Model/Task';
import {Utils} from '../Utils';
import {TaskSummary} from '../Model/TaskSummary';
import {HttpClient} from '../Http/HttpClient';

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

    public async getTask(taskId: string): Promise<Task | null> {

        try {
            const rawTask: any = await this.httpClient.request('/tasks/' + taskId);

            if (Utils.isNullOrUndefined(rawTask)) {
                return null;
            }
            return Task.parse(rawTask);

        } catch (error: any) {
            if (error.code === HttpClient.HTTP_NOTFOUND) {
                return null;
            }
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load tasks: ' + error);
            }

            throw error;
        }

    }

    public getTaskSummaries(projectId: string, projectEnvironmentId: string | null = null): Promise<TaskSummary[]> {
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

    public async getTaskSummary(taskId: string, projectEnvironmentId: string | null = null): Promise<TaskSummary> {

        let parameters: any = null;
        if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
            parameters = {environment: projectEnvironmentId};
        }

        try {
            const rawTaskSummary: any = await this.httpClient.request('tasks/' + taskId + '/summaries', parameters);
            if (Utils.isNullOrUndefined(rawTaskSummary)) {
                throw new Error('Task not found');
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
            let url: string = '/projects/' + task.projectId + '/tasks';

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
