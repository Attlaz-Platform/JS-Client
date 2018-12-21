import {Log} from "./Log/Log";
import {LogType} from './Log/LogType';

export class TaskExecutionLog extends Log {
    public taskExecution: string;

    public static parse(rawTaskExecutionLog: any): TaskExecutionLog {
        let taskExecutionLog: TaskExecutionLog = new TaskExecutionLog();
        taskExecutionLog.id = rawTaskExecutionLog.id;
        taskExecutionLog.taskExecution = rawTaskExecutionLog.jobSchedule;
        taskExecutionLog.date = rawTaskExecutionLog.date;
        taskExecutionLog.level = rawTaskExecutionLog.level;
        taskExecutionLog.message = rawTaskExecutionLog.message;
        taskExecutionLog.type = LogType.fromString(rawTaskExecutionLog.type);
        taskExecutionLog.context = rawTaskExecutionLog.context;
        return taskExecutionLog;
    }
}
