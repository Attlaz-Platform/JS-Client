import {Log} from "./Log/Log";
import {LogType} from './Log/LogType';

export class TaskExecutionLog extends Log {
    public taskExecution: string;

    public static parse(rawTaskExecutionLog: any): TaskExecutionLog {
        let commandExecutionLog: TaskExecutionLog = new TaskExecutionLog();
        commandExecutionLog.id = rawTaskExecutionLog.id;
        commandExecutionLog.taskExecution = rawTaskExecutionLog.jobSchedule;
        commandExecutionLog.date = rawTaskExecutionLog.date;
        commandExecutionLog.level = rawTaskExecutionLog.level;
        commandExecutionLog.message = rawTaskExecutionLog.message;
        commandExecutionLog.type = LogType.fromString(rawTaskExecutionLog.type);
        commandExecutionLog.context = rawTaskExecutionLog.context;
        return commandExecutionLog;
    }
}