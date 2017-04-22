import CommandExecutionStatus from "./CommandExecutionStatus";
import { CommandExecutionLog } from "./CommandExecutionLog";
export declare class CommandExecution {
    id: number;
    command: number;
    status: CommandExecutionStatus;
    trigger: string;
    created: Date;
    scheduled: Date;
    executed: Date;
    finished: Date;
    log: Array<CommandExecutionLog>;
}
