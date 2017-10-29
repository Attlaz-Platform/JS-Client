import { Branch } from "./Model/Branch";
import { Command } from "./Model/Command";
import { CommandExecution } from "./Model/CommandExecution";
import { CommandExecutionLog } from "./Model/CommandExecutionLog";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
export declare class Client {
    private apiEndpoint;
    constructor(apiEndpoint: string);
    /**
     * Get commands for current selected branch
     * @returns {Observable<Command[]>}
     */
    getCommands(): Observable<Command[]>;
    /**
     * Get branches to which the authenticated user has access to
     * @returns {Observable<Branch[]>}
     */
    getBranches(): Observable<Branch[]>;
    getCommandExecutionsBetweenDates(commands: Command[], from: Date, to: Date): Observable<CommandExecution[]>;
    getCommandExecutionLog(commandExecution: CommandExecution): Observable<CommandExecutionLog[]>;
    getCommandExecution(command: Command, from: Date, to: Date): Observable<CommandExecution[]>;
}
