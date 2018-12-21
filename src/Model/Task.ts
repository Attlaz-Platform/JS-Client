export class Task {
    public id: string;
    public key: string;
    public project: string;
    public name: string;
    public description: string;
    public direct: boolean = false;

    public static parse(rawTask: any): Task {
        let task: Task = new Task();
        task.id = rawTask.id;
        task.key = rawTask.key;
        task.project = rawTask.project;
        task.name = rawTask.name;
        task.description = rawTask.description;
        task.direct = rawTask.direct;

        return task;
    }
}
