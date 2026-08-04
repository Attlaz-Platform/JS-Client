import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {Utils} from '../../Utils.js';
import {ApiRecord} from '../../Model/ApiRecord.js';
import {LogLevel} from '../../Logging/Model/LogLevel.js';
import {LogStreamId} from '../../Logging/Model/LogStreamId.js';
import {FlowRunPriority} from './FlowRunPriority.js';

export class FlowRun extends MetaDataAware {
    public id: string;
    // public key: string;
    public flowId: string;
    public arguments: object | null;
    public projectEnvironmentId: string;
    public triggerId: string;

    // TODO: implement priority object
    public priority: FlowRunPriority = FlowRunPriority.None;
    public deployId: string;
    public logStreamId: LogStreamId;

    public logLevelCount: Map<LogLevel, number>;
    public logsPurged: boolean = false;


    public static parse(rawFlowRun: ApiRecord): FlowRun {
        const flowRun: FlowRun = MetaDataAware.parseMetaData(new FlowRun(), rawFlowRun);

        flowRun.id = rawFlowRun.id as string;
        flowRun.flowId = rawFlowRun.flow as string;
        flowRun.arguments = rawFlowRun.arguments as object | null;
        flowRun.projectEnvironmentId = rawFlowRun.project_environment as string;
        flowRun.priority = FlowRunPriority.fromString(rawFlowRun.priority as string);
        flowRun.triggerId = rawFlowRun.trigger as string;
        flowRun.deployId = rawFlowRun.deploy as string;
        flowRun.logStreamId = new LogStreamId(rawFlowRun.log_stream as string);
        flowRun.logLevelCount = rawFlowRun.log_level_count as unknown as Map<LogLevel, number>;
        flowRun.logsPurged = Utils.isTrue(rawFlowRun.logs_purged as boolean);

        return flowRun;
    }
}
