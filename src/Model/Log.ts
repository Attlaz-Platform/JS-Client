import {CommandExecutionLogLevel} from "./CommandExecutionLogLevel";
import {Command} from './Command';
import {CommandExecution} from './CommandExecution';

export class Log {
	public id: number;
	public command: Command;
	public commandExecution: CommandExecution;
	public date: Date;
	public level: CommandExecutionLogLevel;
	public message: string;
	public context: object;
}