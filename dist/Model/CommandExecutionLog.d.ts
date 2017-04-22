import CommandExecutionLogLevel from "./CommandExecutionLogLevel";
export declare class CommandExecutionLog {
    id: number;
    jobSchedule: number;
    date: Date;
    level: CommandExecutionLogLevel;
    message: string;
    context: object;
}
