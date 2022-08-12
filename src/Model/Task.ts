import {State} from './State';
import {StateAware} from './StateAware';
import {Utils} from '../Utils';

export class Task implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public description: string;
    public projectId: string;
    public isDirect: boolean = false;
    public state: State = State.Active;

    /** The maximum number of tasks to run at any time (0 = no limit) **/
    public parallelLimit: number = 0;

    public static parse(rawTask: any): Task {
        const task: Task = new Task();
        task.id = rawTask.id;
        task.key = rawTask.key;
        if (rawTask.project !== undefined) {
            task.projectId = rawTask.project;
        } else {
            task.projectId = rawTask.projectId;
        }

        task.name = rawTask.name;
        task.description = rawTask.description;
        if (rawTask.direct !== undefined) {
            task.isDirect = Utils.isTrue(rawTask.direct);
        } else {
            task.isDirect = rawTask.isDirect;
        }

        task.state = State.fromString(rawTask.state);

        task.parallelLimit = 0;
        if (rawTask.parallelLimit !== null && rawTask.parallelLimit !== undefined) {
            task.parallelLimit = Utils.parseInt(rawTask.parallelLimit);
        }

        return task;
    }
}
