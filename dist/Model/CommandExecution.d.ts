import CommandExecutionStatus from "./CommandExecutionStatus";
import { CommandExecutionLog } from "./CommandExecutionLog";
export declare class CommandExecution {
    id: string;
    command: number;
    status: CommandExecutionStatus;
    trigger: string;
    created: Date;
    scheduled: Date;
    executed: Date;
    finished: Date;
    log: Array<CommandExecutionLog>;
}
