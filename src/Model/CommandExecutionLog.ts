import {CommandExecutionLogLevel} from "./CommandExecutionLogLevel";

export class CommandExecutionLog {
    public id: number;
    public jobSchedule: string;
    public date: Date;
    public level: CommandExecutionLogLevel;
    public message: string;
    public context: object;
}