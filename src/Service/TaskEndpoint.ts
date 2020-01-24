import {Endpoint, Task, TaskSummary} from "..";
import {ParseHelper} from '../Helper/ParseHelper';

export class TaskEndpoint extends Endpoint {

    public getTasks(projectId: string): Promise<Task[]> {
        return new Promise<Task[]>((resolve, reject) => {
            this.httpClient.request('projects/' + projectId + '/tasks').then((rawTasks: any[]) => {

                let tasks: Task[] = [];
                for (let rawTask of rawTasks) {
                    tasks.push(Task.parse(rawTask));

                }

                resolve(tasks);

            }).catch((reason:any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public getTask(taskId: string): Promise<Task> {
        return new Promise<Task>((resolve, reject) => {
            this.httpClient.request('/tasks/' + taskId).then((rawTask: any) => {

                resolve(Task.parse(rawTask));

            }).catch((reason:any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public getTaskSummaries(projectId: string, projectEnvironmentId: number = null): Promise<TaskSummary[]> {
        return new Promise<TaskSummary[]>((resolve, reject) => {

            let parameters: any = null;
            if (!ParseHelper.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            this.httpClient.request('projects/' + projectId + '/tasksummaries', parameters).then((rawTaskSummaries: any[]) => {

                let tasks: TaskSummary[] = [];
                for (let rawTaskSummary of rawTaskSummaries) {
                    tasks.push(TaskSummary.parse(rawTaskSummary));

                }

                resolve(tasks);

            }).catch((reason:any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load tasks: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public getTaskSummary(taskId: string, projectEnvironmentId: number = null): Promise<TaskSummary> {
        return new Promise<TaskSummary>((resolve, reject) => {

            let parameters: any = null;
            if (!ParseHelper.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            this.httpClient.request('tasks/' + taskId + '/summaries', parameters).then((rawTaskSummary: any) => {
                resolve(TaskSummary.parse(rawTaskSummary));

            }).catch((reason:any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load task by id ' + taskId + ': ' + reason);
                }

                reject(reason);
            });
        });
    }

    public save(task: Task): Promise<Task> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/projects/' + task.project + '/tasks';

            this.httpClient.request(url, task, 'POST').then((result: any) => {

                resolve(Task.parse(result));

            }).catch((reason:any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save task: ', reason);
                }
                reject(reason);
            });

        });
    }
}
