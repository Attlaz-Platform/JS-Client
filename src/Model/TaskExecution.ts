export class TaskExecution {
    public id: string;
    public code: string;
    public name: string;

    public static parse(rawTaskExecution: any): TaskExecution {
        let taskExecution: TaskExecution = new TaskExecution();
        taskExecution.id = rawTaskExecution.id;
        taskExecution.code = rawTaskExecution.code;
        taskExecution.name = rawTaskExecution.name;

        return taskExecution;
    }
}