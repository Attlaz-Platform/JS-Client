import {LogLevel} from '../Log/LogLevel';
import {Utils} from '../../Utils';
import {FlowRunPriority} from './FlowRunPriority';

export class FlowRun {
    public id: string;
    // public key: string;
    public flowId: string;
    public name: string;
    public arguments: any;
    public projectEnvironmentId: string;
    public triggerId: string;

    // TODO: implement priority object
    public priority: FlowRunPriority = FlowRunPriority.None;
    public deployId: string;

    public logLevelCount: Map<LogLevel, number>;
    public logsPurged: boolean = false;

    public static parse(rawTaskExecution: any): FlowRun {
        let taskExecution: FlowRun = new FlowRun();
        taskExecution.id = rawTaskExecution.id;
        // taskExecution.code = rawTaskExecution.code;
        taskExecution.name = rawTaskExecution.name;
        taskExecution.flowId = rawTaskExecution.flow;
        taskExecution.arguments = rawTaskExecution.arguments;
        taskExecution.projectEnvironmentId = rawTaskExecution.project_environment;
        taskExecution.priority = FlowRunPriority.fromString(rawTaskExecution.priority);
        taskExecution.triggerId = rawTaskExecution.trigger;
        taskExecution.deployId = rawTaskExecution.deploy;
        taskExecution.logLevelCount = rawTaskExecution.log_level_count;
        taskExecution.logsPurged = Utils.isTrue(rawTaskExecution.logs_purged);

        return taskExecution;
    }
}
