import {Endpoint, Task, TaskSummary} from "..";

export class TaskEndpoint extends Endpoint {

    public getTasks(branchId:string): Promise<Task[]> {
        return new Promise<Task[]>((resolve, reject) => {
            this.httpClient.request('branches/' + branchId + '/tasks').then((rawTasks: any[]) => {

                let tasks: Task[] = [];
                for (let rawTask of rawTasks) {
                    tasks.push(Task.parse(rawTask));

                }

                resolve(tasks);

            }).catch((reason) => {
                if(this.httpClient.isDebugEnabled())
                {
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

            }).catch((reason) => {
                if(this.httpClient.isDebugEnabled())
                {
                    console.error('Failed to load tasks: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public getTaskSummaries(branchId:string): Promise<TaskSummary[]> {
        return new Promise<TaskSummary[]>((resolve, reject) => {
            this.httpClient.request('branches/' + branchId + '/tasksummaries').then((rawTaskSummaries: any[]) => {

                let tasks: TaskSummary[] = [];
                for (let rawTaskSummary of rawTaskSummaries) {
                    tasks.push(TaskSummary.parse(rawTaskSummary));

                }

                resolve(tasks);

            }).catch((reason) => {
                if(this.httpClient.isDebugEnabled())
                {
                    console.error('Failed to load tasks: ' + reason);
                }

                reject(reason);
            });
        });
    }

    public getTaskSummary(taskId: string): Promise<TaskSummary> {
        return new Promise<TaskSummary>((resolve, reject) => {
            this.httpClient.request('tasks/' + taskId + '/summaries').then((rawTaskSummary: any) => {
                resolve(TaskSummary.parse(rawTaskSummary));

            }).catch((reason) => {
                if(this.httpClient.isDebugEnabled())
                {
                    console.error('Failed to load task by id ' + taskId + ': ' + reason);
                }

                reject(reason);
            });
        });
    }
}