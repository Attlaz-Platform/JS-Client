export class TaskExecution {
    public id: string;
    public code: string;
    public name: string;

    public arguments: any;
    public projectEnvironment: number;
    public trigger: string;

    public static parse(rawTaskExecution: any): TaskExecution {
        let taskExecution: TaskExecution = new TaskExecution();
        taskExecution.id = rawTaskExecution.id;
        taskExecution.code = rawTaskExecution.code;
        taskExecution.name = rawTaskExecution.name;
        taskExecution.arguments = rawTaskExecution.arguments;
        taskExecution.projectEnvironment = rawTaskExecution.projectEnvironment;
        taskExecution.trigger = rawTaskExecution.trigger;

        return taskExecution;
    }
}
