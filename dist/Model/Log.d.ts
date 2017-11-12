import { CommandExecutionLogLevel } from "./CommandExecutionLogLevel";
import { Command } from './Command';
import { CommandExecution } from './CommandExecution';
export declare class Log {
    id: number;
    command: Command;
    commandExecution: CommandExecution;
    date: Date;
    level: CommandExecutionLogLevel;
    message: string;
    context: object;
}
