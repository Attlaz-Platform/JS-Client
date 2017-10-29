"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Branch_1 = require("./Model/Branch");
const Command_1 = require("./Model/Command");
const CommandExecution_1 = require("./Model/CommandExecution");
const CommandExecutionStatus_1 = require("./Model/CommandExecutionStatus");
const CommandExecutionLog_1 = require("./Model/CommandExecutionLog");
const CommandExecutionLogLevel_1 = require("./Model/CommandExecutionLogLevel");
const Observable_1 = require("rxjs/Observable");
require("rxjs/Rx");
class Client {
    constructor(apiEndpoint) {
        this.apiEndpoint = '';
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
    getCommands() {
        let commands = [];
        let command1 = new Command_1.Command();
        command1.id = 0;
        command1.branch = 0;
        command1.label = 'Command 1';
        command1.task = 'Run command 1';
        command1.runExpression = '* * * * * *';
        command1.active = true;
        commands.push(command1);
        let command2 = new Command_1.Command();
        command2.id = 1;
        command2.branch = 0;
        command2.label = 'Command 2';
        command2.task = 'run command 2';
        command2.runExpression = '* * * * * *';
        command2.active = true;
        commands.push(command2);
        let command3 = new Command_1.Command();
        command3.id = 1;
        command3.branch = 0;
        command3.label = 'Command 3';
        command3.task = 'run command 3';
        command3.runExpression = '* * * * * *';
        command3.active = false;
        commands.push(command3);
        return Observable_1.Observable.of(commands);
    }
    /**
     * Get branches to which the authenticated user has access to
     * @returns {Observable<Branch[]>}
     */
    getBranches() {
        let branches = [];
        let branch1 = new Branch_1.Branch();
        branch1.id = 0;
        branch1.code = 'branch1';
        branch1.title = 'Branch1';
        branches.push(branch1);
        let branch2 = new Branch_1.Branch();
        branch2.id = 1;
        branch2.code = 'branch1';
        branch2.title = 'Branch1';
        branches.push(branch2);
        return Observable_1.Observable.of(branches);
    }
    getCommandExecutionsBetweenDates(commands, from, to) {
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
        let observables = [];
        for (let command of commands) {
            let o = this.getCommandExecution(command, from, to);
            observables.push(o);
        }
        return Observable_1.Observable.forkJoin(observables).map((results) => {
            let jobSchedules = [];
            for (let result of results) {
                //TODO: merge would be faster (type check?)
                for (let jobSchedule of result) {
                    jobSchedules.push(jobSchedule);
                }
            }
            return jobSchedules;
        });
    }
    getCommandExecutionLog(commandExecution) {
        {
            let commandExecutionLogs = [];
            let commandExecutionLog1 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog1.id = 0;
            commandExecutionLog1.jobSchedule = commandExecution.id;
            commandExecutionLog1.date = new Date((new Date()).getTime() - 0);
            commandExecutionLog1.level = CommandExecutionLogLevel_1.default.Debug;
            commandExecutionLog1.message = 'Debug message';
            commandExecutionLog1.context = [];
            commandExecutionLogs.push(commandExecutionLog1);
            let commandExecutionLog2 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog2.id = 1;
            commandExecutionLog2.jobSchedule = commandExecution.id;
            commandExecutionLog2.date = new Date((new Date()).getTime() - 1000 * 5);
            commandExecutionLog2.level = CommandExecutionLogLevel_1.default.Info;
            commandExecutionLog2.message = 'Info message';
            commandExecutionLog2.context = [];
            commandExecutionLogs.push(commandExecutionLog2);
            let commandExecutionLog3 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog3.id = 2;
            commandExecutionLog3.jobSchedule = commandExecution.id;
            commandExecutionLog3.date = new Date((new Date()).getTime() - 1000 * 10);
            commandExecutionLog3.level = CommandExecutionLogLevel_1.default.Notice;
            commandExecutionLog3.message = 'Notice message';
            commandExecutionLog3.context = [];
            commandExecutionLogs.push(commandExecutionLog3);
            let commandExecutionLog4 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog4.id = 3;
            commandExecutionLog4.jobSchedule = commandExecution.id;
            commandExecutionLog4.date = new Date((new Date()).getTime() - 1000 * 15);
            commandExecutionLog4.level = CommandExecutionLogLevel_1.default.Warning;
            commandExecutionLog4.message = 'Warning message';
            commandExecutionLog4.context = [];
            commandExecutionLogs.push(commandExecutionLog4);
            let commandExecutionLog5 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog5.id = 4;
            commandExecutionLog5.jobSchedule = commandExecution.id;
            commandExecutionLog5.date = new Date((new Date()).getTime() - 1000 * 20);
            commandExecutionLog5.level = CommandExecutionLogLevel_1.default.Error;
            commandExecutionLog5.message = 'Error message';
            commandExecutionLog5.context = [];
            commandExecutionLogs.push(commandExecutionLog5);
            let commandExecutionLog6 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog6.id = 5;
            commandExecutionLog6.jobSchedule = commandExecution.id;
            commandExecutionLog6.date = new Date((new Date()).getTime() - 1000 * 25);
            commandExecutionLog6.level = CommandExecutionLogLevel_1.default.Critical;
            commandExecutionLog6.message = 'Critical message';
            commandExecutionLog6.context = [];
            commandExecutionLogs.push(commandExecutionLog6);
            let commandExecutionLog7 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog7.id = 6;
            commandExecutionLog7.jobSchedule = commandExecution.id;
            commandExecutionLog7.date = new Date((new Date()).getTime() - 1000 * 30);
            commandExecutionLog7.level = CommandExecutionLogLevel_1.default.Alert;
            commandExecutionLog7.message = 'Alert message';
            commandExecutionLog7.context = [];
            commandExecutionLogs.push(commandExecutionLog7);
            let commandExecutionLog8 = new CommandExecutionLog_1.CommandExecutionLog();
            commandExecutionLog8.id = 7;
            commandExecutionLog8.jobSchedule = commandExecution.id;
            commandExecutionLog8.date = new Date((new Date()).getTime() - 1000 * 35);
            commandExecutionLog8.level = CommandExecutionLogLevel_1.default.Emergency;
            commandExecutionLog8.message = 'Emergency message';
            commandExecutionLog8.context = [];
            commandExecutionLogs.push(commandExecutionLog8);
            return Observable_1.Observable.of(commandExecutionLogs);
        }
    }
    getCommandExecution(command, from, to) {
        let commandExecutions = [];
        //Future jobSchedule
        let commandExecution1 = new CommandExecution_1.CommandExecution();
        commandExecution1.id = 0;
        commandExecution1.command = command.id;
        commandExecution1.trigger = 'unknown';
        commandExecution1.status = CommandExecutionStatus_1.default.PENDING;
        commandExecution1.created = new Date('2017-02-09 10:15');
        commandExecution1.scheduled = new Date((new Date()).getTime() + (1000 * 60));
        commandExecutions.push(commandExecution1);
        //Running jobSchedule
        let jobSchedule2 = new CommandExecution_1.CommandExecution();
        jobSchedule2.id = 1;
        jobSchedule2.command = command.id;
        jobSchedule2.trigger = 'cron';
        jobSchedule2.status = CommandExecutionStatus_1.default.RUNNING;
        jobSchedule2.created = new Date('2017-02-09 10:15');
        jobSchedule2.scheduled = new Date((new Date()).getTime() - (1000 * 60));
        commandExecutions.push(jobSchedule2);
        //Completed jobSchedule
        let jobSchedule3 = new CommandExecution_1.CommandExecution();
        jobSchedule3.id = 2;
        jobSchedule3.command = command.id;
        jobSchedule3.trigger = 'cron job';
        jobSchedule3.status = CommandExecutionStatus_1.default.COMPLETE;
        jobSchedule3.created = new Date('2017-02-09 10:15');
        jobSchedule3.scheduled = new Date((new Date()).getTime() - (2000 * 60));
        jobSchedule3.executed = new Date((new Date()).getTime() - (2000 * 60));
        jobSchedule3.finished = new Date((new Date()).getTime());
        commandExecutions.push(jobSchedule3);
        //Completed jobSchedule
        let jobSchedule4 = new CommandExecution_1.CommandExecution();
        jobSchedule4.id = 3;
        jobSchedule4.command = command.id;
        jobSchedule4.trigger = 'manual';
        jobSchedule4.status = CommandExecutionStatus_1.default.COMPLETE;
        jobSchedule4.created = new Date('2017-02-09 10:15');
        jobSchedule4.scheduled = new Date((new Date()).getTime() - (2000 * 60));
        jobSchedule4.executed = new Date((new Date()).getTime() - (2000 * 60));
        jobSchedule4.finished = new Date((new Date()).getTime());
        commandExecutions.push(jobSchedule4);
        return Observable_1.Observable.of(commandExecutions);
    }
}
exports.Client = Client;
