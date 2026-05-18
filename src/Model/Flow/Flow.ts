import {State} from '../State.js';
import {Utils} from '../../Utils.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {ApiRecord} from '../ApiRecord.js';

export class Flow extends MetaDataAware implements StateAware {
    public id: string;
    public key: string;
    public projectId: string;
    public isDirect: boolean = false;
    public state: State = State.Active;

    /** The maximum number of flows to run at any time (0 = no limit) * */
    public parallelLimit: number = 0;

    public codeSourceId: string | null = null;
    public runStrategyId: string | null = null;
    public runnerPoolId: string | null = null;

    public static parse(rawFlow: ApiRecord): Flow {
        const flow: Flow = MetaDataAware.parseMetaData(new Flow(), rawFlow);
        flow.key = rawFlow.key as string;
        flow.projectId = rawFlow.project as string;
        flow.isDirect = Utils.isTrue(rawFlow.is_direct as boolean);
        flow.state = State.fromString(rawFlow.state as string);

        flow.parallelLimit = Utils.parseInt(rawFlow.parallel_limit as number);
        flow.codeSourceId = rawFlow.code_source as string | null;
        flow.runStrategyId = rawFlow.run_strategy as string | null;
        flow.runnerPoolId = rawFlow.runner_pool as string | null;

        return flow;
    }
}
