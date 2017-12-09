import {Branch} from "./Model/Branch";
import {Command} from "./Model/Command";
import {CommandExecution} from "./Model/CommandExecution";
import CommandExecutionStatus from "./Model/CommandExecutionStatus";
import {CommandExecutionLog} from "./Model/CommandExecutionLog";
import {CommandExecutionLogLevel} from "./Model/CommandExecutionLogLevel";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Log} from './Model/Log';
import {Subscriber} from "rxjs/Subscriber";


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


    private get(url: string): Promise<any> {
        return new Promise<any>(
            function (resolve, reject) {
                const request = new XMLHttpRequest();
                request.onload = (evt: ProgressEvent) => {

                    resolve(request.responseText);
                    // console.log('onload', evt);
                    // if (this.status === 200) {
                    //     resolve(this.response);
                    // } else {
                    //     reject(new Error(this.statusText));
                    // }
                };
                request.onerror = () => {
                    reject(false);
                    //  reject(new Error('XMLHttpRequest Error: ' + this.statusText));
                };

                // request.onreadystatechange = (evt: Event) => {
                //     console.log(evt);
                //     console.log(request.readyState);
                // };


                request.open('GET', url);
                request.send();
            });
    }

    public getLogs(): Observable<Log[]> {


        return Observable.create((subscribe: Subscriber<Log[]>) => {
            this.get('http://localhost:8080/system/logs').then((strLogs: string) => {
                let rawLogs = JSON.parse(strLogs);

                // console.log(logs);


                let command: Command = new Command();
                command.id = 0;
                command.branch = 0;
                command.label = 'Command 1';
                command.task = 'Run command 1';
                command.runExpression = '* * * * * *';
                command.active = true;


                let commandExecution: CommandExecution = new CommandExecution();
                commandExecution.id = '698a1330-ae45-44ec-b578-9d07ecff8e09';
                commandExecution.command = command.id;
                commandExecution.trigger = 'manual';
                commandExecution.status = CommandExecutionStatus.COMPLETE;
                commandExecution.created = new Date('2017-02-09 10:15');
                commandExecution.scheduled = new Date((new Date()).getTime() - (2000 * 60));
                commandExecution.executed = new Date((new Date()).getTime() - (2000 * 60));
                commandExecution.finished = new Date((new Date()).getTime());

                let logs: Log[] = [];
                for (let rawLog of rawLogs) {


                    let log: Log = new Log();
                    log.id = rawLog.id;
                    log.command = command;
                    log.commandExecution = commandExecution;
                    log.date = rawLog.date;
                    log.level = rawLog.level;
                    log.message = rawLog.message;
                    log.context = rawLog.context;

                    logs.push(log);
                }

                subscribe.next(logs);

                subscribe.complete();
            });
        });


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
        commandExecution1.id = '0';
        commandExecution1.command = command.id;
        commandExecution1.trigger = 'unknown';
        commandExecution1.status = CommandExecutionStatus.PENDING;
        commandExecution1.created = new Date('2017-02-09 10:15');
        commandExecution1.scheduled = new Date((new Date()).getTime() + (1000 * 60));

        commandExecutions.push(commandExecution1);
//Running jobSchedule
        let jobSchedule2: CommandExecution = new CommandExecution();
        jobSchedule2.id = '1';
        jobSchedule2.command = command.id;
        jobSchedule2.trigger = 'cron';
        jobSchedule2.status = CommandExecutionStatus.RUNNING;
        jobSchedule2.created = new Date('2017-02-09 10:15');
        jobSchedule2.scheduled = new Date((new Date()).getTime() - (1000 * 60));

        commandExecutions.push(jobSchedule2);

        //Completed jobSchedule
        let jobSchedule3: CommandExecution = new CommandExecution();
        jobSchedule3.id = '2';
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
        jobSchedule4.id = '3';
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