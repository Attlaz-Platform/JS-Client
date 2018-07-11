import {Endpoint, Task, TaskSummary} from "..";

export class TaskEndpoint extends Endpoint {

    public getTasks(): Promise<Task[]> {
        return new Promise<Task[]>((resolve, reject) => {
            this.httpClient.request('branch/' + this.httpClient.getBranchId() + '/task').then((rawTasks: any[]) => {

                let tasks: Task[] = [];
                for (let rawTask of rawTasks) {
                    tasks.push((rawTask as Task));

                }

                resolve(tasks);

            }).catch((reason) => {
                console.log('Failed to load tasks: ' + reason);
                reject(reason);
            });
        });
    }

    public getTask(taskId: string): Promise<Task> {
        return new Promise<Task>((resolve, reject) => {
            this.httpClient.request('branch/' + this.httpClient.getBranchId() + '/task/' + taskId).then((rawTask: any) => {

                resolve((rawTask as Task));

            }).catch((reason) => {
                console.log('Failed to load tasks: ' + reason);
                reject(reason);
            });
        });
    }

    public getTaskSummaries(): Promise<TaskSummary[]> {
        return new Promise<TaskSummary[]>((resolve, reject) => {
            this.httpClient.request('branch/' + this.httpClient.getBranchId() + '/tasksummary').then((rawTaskSummaries: any[]) => {

                let tasks: TaskSummary[] = [];
                for (let rawTaskSummary of rawTaskSummaries) {
                    tasks.push((rawTaskSummary as TaskSummary));

                }

                resolve(tasks);

            }).catch((reason) => {
                console.log('Failed to load tasks: ' + reason);
                reject(reason);
            });
        });
    }

    public getTaskSummary(taskId: string): Promise<TaskSummary> {
        return new Promise<TaskSummary>((resolve, reject) => {
            this.httpClient.request('branch/' + this.httpClient.getBranchId() + '/task/' + taskId + '/summary').then((rawTaskSummary: any) => {
                resolve((rawTaskSummary as TaskSummary));

            }).catch((reason) => {
                console.log('Failed to load task by id ' + taskId + ': ' + reason);
                reject(reason);
            });
        });
    }
}