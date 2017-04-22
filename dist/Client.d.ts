import { Branch } from "./Model/Branch";
import { Command } from "./Model/Command";
import { CommandExecution } from "./Model/CommandExecution";
import { CommandExecutionLog } from "./Model/CommandExecutionLog";
export declare class Client {
    private apiEndpoint;
    constructor(apiEndpoint: string);
    /**
     * Get commands for current selected branch
     * @returns {Promise<Array<>>}
     */
    getCommands(): Promise<Array<Command>>;
    /**
     * Get branches to which the authenticated user has access to
     * @returns {Promise<Array<Branch>>}
     */
    getBranches(): Promise<Array<Branch>>;
    getCommandExecutionsBetweenDates(commands: Array<Command>, from: Date, to: Date): Promise<Array<CommandExecution>>;
    getCommandExecutionLog(commandExecution: CommandExecution): Promise<Array<CommandExecutionLog>>;
    getCommandExecution(command: Command, from: Date, to: Date): Promise<Array<CommandExecution>>;
}
