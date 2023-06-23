import {LogLevel} from '../Log/LogLevel.js';
import {Utils} from '../../Utils.js';
import {FlowRunPriority} from './FlowRunPriority.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {DataValueCollection} from '../DataValueCollection.js';

export class FlowRun extends MetaDataAware {
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

    public static parse(rawFlowRun: any): FlowRun {
        const flowRun: FlowRun = new FlowRun();
        flowRun.id = rawFlowRun.id;
        flowRun.flowId = rawFlowRun.flow;
        flowRun.arguments = rawFlowRun.arguments;
        flowRun.projectEnvironmentId = rawFlowRun.project_environment;
        flowRun.priority = FlowRunPriority.fromString(rawFlowRun.priority);
        flowRun.triggerId = rawFlowRun.trigger;
        flowRun.deployId = rawFlowRun.deploy;
        flowRun.logLevelCount = rawFlowRun.log_level_count;
        flowRun.logsPurged = Utils.isTrue(rawFlowRun.logs_purged);
        flowRun.metadata = DataValueCollection.fromObject(rawFlowRun.metadata);
        return flowRun;
    }
}
