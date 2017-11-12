import {Branch} from "./Model/Branch";
import {Command} from "./Model/Command";
import {CommandExecution} from "./Model/CommandExecution";
import CommandExecutionStatus from "./Model/CommandExecutionStatus";
import {CommandExecutionLog} from "./Model/CommandExecutionLog";
import {CommandExecutionLogLevel} from "./Model/CommandExecutionLogLevel";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Log} from './Model/Log';


export class Client {
	private apiEndpoint = '';

	constructor(apiEndpoint: string) {
		this.apiEndpoint = apiEndpoint;
	}

	// get name() {
	//     return this._name;
	// }
	//
	// set name(value: string) {
	//     this._name = value;
	// }

	/**
	 * Get commands for current selected branch
	 * @returns {Observable<Command[]>}
	 */
	public getCommands(): Observable<Command[]> {
		let commands: Command[] = [];

		let command1: Command = new Command();
		command1.id = 0;
		command1.branch = 0;
		command1.label = 'Command 1';
		command1.task = 'Run command 1';
		command1.runExpression = '* * * * * *';
		command1.active = true;

		commands.push(command1);


		let command2: Command = new Command();
		command2.id = 1;
		command2.branch = 0;
		command2.label = 'Command 2';
		command2.task = 'run command 2';
		command2.runExpression = '* * * * * *';
		command2.active = true;

		commands.push(command2);

		let command3: Command = new Command();
		command3.id = 1;
		command3.branch = 0;
		command3.label = 'Command 3';
		command3.task = 'run command 3';
		command3.runExpression = '* * * * * *';
		command3.active = false;

		commands.push(command3);

		return Observable.of(commands);
	}

	/**
	 * Get branches to which the authenticated user has access to
	 * @returns {Observable<Branch[]>}
	 */
	public getBranches(): Observable<Branch[]> {
		let branches: Branch[] = [];

		let branch1: Branch = new Branch();
		branch1.id = 0;
		branch1.code = 'branch1';
		branch1.title = 'Branch1';
		branches.push(branch1);

		let branch2: Branch = new Branch();
		branch2.id = 1;
		branch2.code = 'branch1';
		branch2.title = 'Branch1';
		branches.push(branch2);

		return Observable.of(branches);
	}

	public getCommandExecutionsBetweenDates(commands: Command[], from: Date, to: Date): Observable<CommandExecution[]> {

		// return new Promise((resolve, reject) => {
		//     let promises: Array<Promise<Array<CommandExecution>>> = [];
		//
		//     for (let command of commands) {
		//         let p: Promise<Array<CommandExecution>> = this.getCommandExecution(command, from, to);
		//         promises.push(p);
		//     }
		//
		//     Promise.all(promises).then((results) => {
		//         let jobSchedules: Array<CommandExecution> = [];
		//         for (let result of results) {
		//
		//             //TODO: merge would be faster (type check?)
		//             for (let jobSchedule of result) {
		//                 jobSchedules.push(jobSchedule);
		//             }
		//
		//         }
		//         resolve(jobSchedules);
		//     });
		// });

		let observables: Observable<CommandExecution[]>[] = [];

		for (let command of commands) {
			let o: Observable<CommandExecution[]> = this.getCommandExecution(command, from, to);
			observables.push(o);
		}

		return Observable.forkJoin(observables).map((results: any) => {
			let commandExecutions: Array<CommandExecution> = [];
			for (let result of results) {

				//TODO: merge would be faster (type check?)
				for (let commandExecution of result) {
					commandExecutions.push(commandExecution);
				}
			}
			return commandExecutions;
		});

	}

	public getLogs(): Observable<Log[]> {

		let command1: Command = new Command();
		command1.id = 0;
		command1.branch = 0;
		command1.label = 'Command 1';
		command1.task = 'Run command 1';
		command1.runExpression = '* * * * * *';
		command1.active = true;

		let command2: Command = new Command();
		command2.id = 1;
		command2.branch = 0;
		command2.label = 'Command 2';
		command2.task = 'run command 2';
		command2.runExpression = '* * * * * *';
		command2.active = true;


		let command3: Command = new Command();
		command3.id = 1;
		command3.branch = 0;
		command3.label = 'Command 3';
		command3.task = 'run command 3';
		command3.runExpression = '* * * * * *';
		command3.active = false;

		let commandExecution1: CommandExecution = new CommandExecution();
		commandExecution1.id = 0;
		commandExecution1.command = command1.id;
		commandExecution1.trigger = 'unknown';
		commandExecution1.status = CommandExecutionStatus.PENDING;
		commandExecution1.created = new Date('2017-02-09 10:15');
		commandExecution1.scheduled = new Date((new Date()).getTime() + (1000 * 60));

//Running jobSchedule
		let jobSchedule2: CommandExecution = new CommandExecution();
		jobSchedule2.id = 1;
		jobSchedule2.command = command2.id;
		jobSchedule2.trigger = 'cron';
		jobSchedule2.status = CommandExecutionStatus.RUNNING;
		jobSchedule2.created = new Date('2017-02-09 10:15');
		jobSchedule2.scheduled = new Date((new Date()).getTime() - (1000 * 60));


		//Completed jobSchedule
		let jobSchedule3: CommandExecution = new CommandExecution();
		jobSchedule3.id = 2;
		jobSchedule3.command = command3.id;
		jobSchedule3.trigger = 'cron job';
		jobSchedule3.status = CommandExecutionStatus.COMPLETE;
		jobSchedule3.created = new Date('2017-02-09 10:15');
		jobSchedule3.scheduled = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule3.executed = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule3.finished = new Date((new Date()).getTime());

		//Completed jobSchedule
		let jobSchedule4: CommandExecution = new CommandExecution();
		jobSchedule4.id = 3;
		jobSchedule4.command = command1.id;
		jobSchedule4.trigger = 'manual';
		jobSchedule4.status = CommandExecutionStatus.COMPLETE;
		jobSchedule4.created = new Date('2017-02-09 10:15');
		jobSchedule4.scheduled = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule4.executed = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule4.finished = new Date((new Date()).getTime());

		let commandExecutionLog1: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog1.id = 0;
		commandExecutionLog1.jobSchedule = commandExecution1.id;
		commandExecutionLog1.date = new Date((new Date()).getTime());
		commandExecutionLog1.level = CommandExecutionLogLevel.Debug;
		commandExecutionLog1.message = 'Debug message';
		commandExecutionLog1.context = [];

		let commandExecutionLog2: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog2.id = 1;
		commandExecutionLog2.jobSchedule = commandExecution1.id;
		commandExecutionLog2.date = new Date((new Date()).getTime() - 1000 * 5);
		commandExecutionLog2.level = CommandExecutionLogLevel.Info;
		commandExecutionLog2.message = 'Info message';
		commandExecutionLog2.context = [];

		let commandExecutionLog3: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog3.id = 2;
		commandExecutionLog3.jobSchedule = commandExecution1.id;
		commandExecutionLog3.date = new Date((new Date()).getTime() - 1000 * 10);
		commandExecutionLog3.level = CommandExecutionLogLevel.Notice;
		commandExecutionLog3.message = 'Notice message';
		commandExecutionLog3.context = [];

		let commandExecutionLog4: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog4.id = 3;
		commandExecutionLog4.jobSchedule = commandExecution1.id;
		commandExecutionLog4.date = new Date((new Date()).getTime() - 1000 * 15);
		commandExecutionLog4.level = CommandExecutionLogLevel.Warning;
		commandExecutionLog4.message = 'Warning message';
		commandExecutionLog4.context = [];

		let commandExecutionLog5: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog5.id = 4;
		commandExecutionLog5.jobSchedule = commandExecution1.id;
		commandExecutionLog5.date = new Date((new Date()).getTime() - 1000 * 20);
		commandExecutionLog5.level = CommandExecutionLogLevel.Error;
		commandExecutionLog5.message = 'Error message';
		commandExecutionLog5.context = [];

		let commandExecutionLog6: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog6.id = 5;
		commandExecutionLog6.jobSchedule = commandExecution1.id;
		commandExecutionLog6.date = new Date((new Date()).getTime() - 1000 * 25);
		commandExecutionLog6.level = CommandExecutionLogLevel.Critical;
		commandExecutionLog6.message = 'Critical message';
		commandExecutionLog6.context = [];

		let commandExecutionLog7: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog7.id = 6;
		commandExecutionLog7.jobSchedule = commandExecution1.id;
		commandExecutionLog7.date = new Date((new Date()).getTime() - 1000 * 30);
		commandExecutionLog7.level = CommandExecutionLogLevel.Alert;
		commandExecutionLog7.message = 'Alert message';
		commandExecutionLog7.context = [];

		let commandExecutionLog8: CommandExecutionLog = new CommandExecutionLog();
		commandExecutionLog8.id = 7;
		commandExecutionLog8.jobSchedule = commandExecution1.id;
		commandExecutionLog8.date = new Date((new Date()).getTime() - 1000 * 35);
		commandExecutionLog8.level = CommandExecutionLogLevel.Emergency;
		commandExecutionLog8.message = 'Emergency message';
		commandExecutionLog8.context = [];

		let log1: Log = new Log();
		log1.id = 0;
		log1.command = command1;
		log1.commandExecution = commandExecution1;
		log1.date = commandExecutionLog1.date;
		log1.level = commandExecutionLog1.level;
		log1.message = commandExecutionLog1.message;
		log1.context = commandExecutionLog1.context;

		let log2: Log = new Log();
		log2.id = 0;
		log2.command = command1;
		log2.commandExecution = commandExecution1;
		log2.date = commandExecutionLog2.date;
		log2.level = commandExecutionLog2.level;
		log2.message = commandExecutionLog2.message;
		log2.context = commandExecutionLog2.context;

		let log3: Log = new Log();
		log3.id = 0;
		log3.command = command1;
		log3.commandExecution = commandExecution1;
		log3.date = commandExecutionLog3.date;
		log3.level = commandExecutionLog3.level;
		log3.message = commandExecutionLog3.message;
		log3.context = commandExecutionLog3.context;

		let log4: Log = new Log();
		log4.id = 0;
		log4.command = command1;
		log4.commandExecution = commandExecution1;
		log4.date = commandExecutionLog4.date;
		log4.level = commandExecutionLog4.level;
		log4.message = commandExecutionLog4.message;
		log4.context = commandExecutionLog4.context;

		let log5: Log = new Log();
		log5.id = 0;
		log5.command = command1;
		log5.commandExecution = commandExecution1;
		log5.date = commandExecutionLog5.date;
		log5.level = commandExecutionLog5.level;
		log5.message = commandExecutionLog5.message;
		log5.context = commandExecutionLog5.context;

		let log6: Log = new Log();
		log6.id = 0;
		log6.command = command1;
		log6.commandExecution = commandExecution1;
		log6.date = commandExecutionLog6.date;
		log6.level = commandExecutionLog6.level;
		log6.message = commandExecutionLog6.message;
		log6.context = commandExecutionLog6.context;

		let log7: Log = new Log();
		log7.id = 0;
		log7.command = command1;
		log7.commandExecution = commandExecution1;
		log7.date = commandExecutionLog7.date;
		log7.level = commandExecutionLog7.level;
		log7.message = commandExecutionLog7.message;
		log7.context = commandExecutionLog7.context;

		let log8: Log = new Log();
		log8.id = 0;
		log8.command = command1;
		log8.commandExecution = commandExecution1;
		log8.date = commandExecutionLog8.date;
		log8.level = commandExecutionLog8.level;
		log8.message = commandExecutionLog8.message;
		log8.context = commandExecutionLog8.context;

		return Observable.of([log1, log2, log3, log4, log5, log6, log7, log8]);
	}

	public getCommandExecutionLog(commandExecution: CommandExecution): Observable<CommandExecutionLog[]> {
		{

			let commandExecutionLogs: Array<CommandExecutionLog> = [];

			let commandExecutionLog1: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog1.id = 0;
			commandExecutionLog1.jobSchedule = commandExecution.id;
			commandExecutionLog1.date = new Date((new Date()).getTime());
			commandExecutionLog1.level = CommandExecutionLogLevel.Debug;
			commandExecutionLog1.message = 'Debug message';
			commandExecutionLog1.context = [];
			commandExecutionLogs.push(commandExecutionLog1);

			let commandExecutionLog2: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog2.id = 1;
			commandExecutionLog2.jobSchedule = commandExecution.id;
			commandExecutionLog2.date = new Date((new Date()).getTime() - 1000 * 5);
			commandExecutionLog2.level = CommandExecutionLogLevel.Info;
			commandExecutionLog2.message = 'Info message';
			commandExecutionLog2.context = [];
			commandExecutionLogs.push(commandExecutionLog2);

			let commandExecutionLog3: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog3.id = 2;
			commandExecutionLog3.jobSchedule = commandExecution.id;
			commandExecutionLog3.date = new Date((new Date()).getTime() - 1000 * 10);
			commandExecutionLog3.level = CommandExecutionLogLevel.Notice;
			commandExecutionLog3.message = 'Notice message';
			commandExecutionLog3.context = [];
			commandExecutionLogs.push(commandExecutionLog3);

			let commandExecutionLog4: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog4.id = 3;
			commandExecutionLog4.jobSchedule = commandExecution.id;
			commandExecutionLog4.date = new Date((new Date()).getTime() - 1000 * 15);
			commandExecutionLog4.level = CommandExecutionLogLevel.Warning;
			commandExecutionLog4.message = 'Warning message';
			commandExecutionLog4.context = [];
			commandExecutionLogs.push(commandExecutionLog4);

			let commandExecutionLog5: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog5.id = 4;
			commandExecutionLog5.jobSchedule = commandExecution.id;
			commandExecutionLog5.date = new Date((new Date()).getTime() - 1000 * 20);
			commandExecutionLog5.level = CommandExecutionLogLevel.Error;
			commandExecutionLog5.message = 'Error message';
			commandExecutionLog5.context = [];
			commandExecutionLogs.push(commandExecutionLog5);

			let commandExecutionLog6: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog6.id = 5;
			commandExecutionLog6.jobSchedule = commandExecution.id;
			commandExecutionLog6.date = new Date((new Date()).getTime() - 1000 * 25);
			commandExecutionLog6.level = CommandExecutionLogLevel.Critical;
			commandExecutionLog6.message = 'Critical message';
			commandExecutionLog6.context = [];
			commandExecutionLogs.push(commandExecutionLog6);

			let commandExecutionLog7: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog7.id = 6;
			commandExecutionLog7.jobSchedule = commandExecution.id;
			commandExecutionLog7.date = new Date((new Date()).getTime() - 1000 * 30);
			commandExecutionLog7.level = CommandExecutionLogLevel.Alert;
			commandExecutionLog7.message = 'Alert message';
			commandExecutionLog7.context = [];
			commandExecutionLogs.push(commandExecutionLog7);

			let commandExecutionLog8: CommandExecutionLog = new CommandExecutionLog();
			commandExecutionLog8.id = 7;
			commandExecutionLog8.jobSchedule = commandExecution.id;
			commandExecutionLog8.date = new Date((new Date()).getTime() - 1000 * 35);
			commandExecutionLog8.level = CommandExecutionLogLevel.Emergency;
			commandExecutionLog8.message = 'Emergency message';
			commandExecutionLog8.context = [];
			commandExecutionLogs.push(commandExecutionLog8);

			return Observable.of(commandExecutionLogs);
		}
	}

	public getCommandExecution(command: Command, from: Date, to: Date): Observable<CommandExecution[]> {

		let commandExecutions: CommandExecution[] = [];


//Future jobSchedule
		let commandExecution1: CommandExecution = new CommandExecution();
		commandExecution1.id = 0;
		commandExecution1.command = command.id;
		commandExecution1.trigger = 'unknown';
		commandExecution1.status = CommandExecutionStatus.PENDING;
		commandExecution1.created = new Date('2017-02-09 10:15');
		commandExecution1.scheduled = new Date((new Date()).getTime() + (1000 * 60));

		commandExecutions.push(commandExecution1);
//Running jobSchedule
		let jobSchedule2: CommandExecution = new CommandExecution();
		jobSchedule2.id = 1;
		jobSchedule2.command = command.id;
		jobSchedule2.trigger = 'cron';
		jobSchedule2.status = CommandExecutionStatus.RUNNING;
		jobSchedule2.created = new Date('2017-02-09 10:15');
		jobSchedule2.scheduled = new Date((new Date()).getTime() - (1000 * 60));

		commandExecutions.push(jobSchedule2);

		//Completed jobSchedule
		let jobSchedule3: CommandExecution = new CommandExecution();
		jobSchedule3.id = 2;
		jobSchedule3.command = command.id;
		jobSchedule3.trigger = 'cron job';
		jobSchedule3.status = CommandExecutionStatus.COMPLETE;
		jobSchedule3.created = new Date('2017-02-09 10:15');
		jobSchedule3.scheduled = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule3.executed = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule3.finished = new Date((new Date()).getTime());

		commandExecutions.push(jobSchedule3);
		//Completed jobSchedule
		let jobSchedule4: CommandExecution = new CommandExecution();
		jobSchedule4.id = 3;
		jobSchedule4.command = command.id;
		jobSchedule4.trigger = 'manual';
		jobSchedule4.status = CommandExecutionStatus.COMPLETE;
		jobSchedule4.created = new Date('2017-02-09 10:15');
		jobSchedule4.scheduled = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule4.executed = new Date((new Date()).getTime() - (2000 * 60));
		jobSchedule4.finished = new Date((new Date()).getTime());

		commandExecutions.push(jobSchedule4);

		return Observable.of(commandExecutions);
	}


}