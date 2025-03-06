import {LogLevel} from '../Log/LogLevel.js';
import {Utils} from '../../Utils.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {FlowRunPriority} from './FlowRunPriority.js';
import {ApiRecord} from '../ApiRecord.js';

export class FlowRun extends MetaDataAware {
    public id: string;
    // public key: string;
    public flowId: string;
    public arguments: any;
    public projectEnvironmentId: string;
    public triggerId: string;

    // TODO: implement priority object
    public priority: FlowRunPriority = FlowRunPriority.None;
    public deployId: string;

    public logLevelCount: Map<LogLevel, number>;
    public logsPurged: boolean = false;


    public static parse(rawFlowRun: ApiRecord): FlowRun {
        const flowRun: FlowRun = MetaDataAware.parseMetaData(new FlowRun(), rawFlowRun);

        flowRun.id = rawFlowRun.id as string;
        flowRun.flowId = rawFlowRun.flow as string;
        flowRun.arguments = rawFlowRun.arguments;
        flowRun.projectEnvironmentId = rawFlowRun.project_environment as string;
        flowRun.priority = FlowRunPriority.fromString(rawFlowRun.priority as string);
        flowRun.triggerId = rawFlowRun.trigger as string;
        flowRun.deployId = rawFlowRun.deploy as string;
        flowRun.logLevelCount = rawFlowRun.log_level_count as unknown as Map<LogLevel, number>;
        flowRun.logsPurged = Utils.isTrue(rawFlowRun.logs_purged as boolean);

        return flowRun;
    }
}
