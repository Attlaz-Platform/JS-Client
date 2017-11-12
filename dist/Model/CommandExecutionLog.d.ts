import { CommandExecutionLogLevel } from "./CommandExecutionLogLevel";
export declare class CommandExecutionLog {
    id: number;
    jobSchedule: string;
    date: Date;
    level: CommandExecutionLogLevel;
    message: string;
    context: object;
}
