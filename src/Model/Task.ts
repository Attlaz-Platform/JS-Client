import {State} from './State';

export class Task {
    public id: string;
    public key: string;
    public name: string;
    public description: string;
    public project: string;
    public direct: boolean = false;
    public state: State = State.Active;

    public static parse(rawTask: any): Task {
        const task: Task = new Task();
        task.id = rawTask.id;
        task.key = rawTask.key;
        task.project = rawTask.project;
        task.name = rawTask.name;
        task.description = rawTask.description;
        task.direct = rawTask.direct;
        task.state = State.fromString(rawTask.state);

        return task;
    }
}
