export class Task {
    public id: string;
    public branch: string;
    public command: string;
    public name: string;
    public description: string;
    public direct: boolean = false;

    public static parse(rawTask: any): Task {
        let task: Task = new Task();
        task.id = rawTask.id;
        task.branch = rawTask.branch;
        task.command = rawTask.command;
        task.name = rawTask.name;
        task.description = rawTask.description;
        task.direct = rawTask.direct;

        return task;
    }
}