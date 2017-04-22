import CommandExecutionStatus from "./CommandExecutionStatus";
import {CommandExecutionLog} from "./CommandExecutionLog";

export class CommandExecution {
    public id: number;
    public command: number;
    public status: CommandExecutionStatus;
    public trigger: string;
    public created: Date;
    public scheduled: Date;
    public executed: Date;
    public finished: Date;
    public log: Array<CommandExecutionLog>;
}