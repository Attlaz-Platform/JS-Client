import {LogLevel} from './Log/LogLevel';

export class TaskExecution {
    public id: string;
    // public key: string;
    public taskId: string;
    public name: string;

    public parentId: string | null = null;
    public arguments: any;
    public projectEnvironmentId: string;
    public triggerId: string;

    public deployId: string;

    public logLevelCount: Map<LogLevel, number>;
    public logsPurged: boolean = false;

    public static parse(rawTaskExecution: any): TaskExecution {
        let taskExecution: TaskExecution = new TaskExecution();
        taskExecution.id = rawTaskExecution.id;
        // taskExecution.code = rawTaskExecution.code;
        taskExecution.name = rawTaskExecution.name;
        if (rawTaskExecution.task !== undefined) {
            taskExecution.taskId = rawTaskExecution.task
        } else {
            taskExecution.taskId = rawTaskExecution.taskId;
        }
        taskExecution.arguments = rawTaskExecution.arguments;

        if (rawTaskExecution.projectEnvironment !== undefined) {
            taskExecution.projectEnvironmentId = rawTaskExecution.projectEnvironment;
        } else {
            taskExecution.projectEnvironmentId = rawTaskExecution.projectEnvironmentId;
        }

        if (rawTaskExecution.trigger !== undefined) {
            taskExecution.triggerId = rawTaskExecution.trigger;
        } else {
            taskExecution.triggerId = rawTaskExecution.triggerId;
        }

        taskExecution.deployId = rawTaskExecution.deployId;
        taskExecution.logLevelCount = rawTaskExecution.logLevelCount;
        taskExecution.logsPurged = rawTaskExecution.logsPurged;

        return taskExecution;
    }
}
