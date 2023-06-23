import {State} from '../State.js';
import {Utils} from '../../Utils.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {DataValueCollection} from '../DataValueCollection.js';

export class Flow extends MetaDataAware implements StateAware {
    public id: string;
    public key: string;
    public name: string;
    public description: string;
    public projectId: string;
    public isDirect: boolean = false;
    public state: State = State.Active;

    /** The maximum number of flows to run at any time (0 = no limit) **/
    public parallelLimit: number = 0;

    public codeSource: string | null = null;

    public static parse(rawFlow: any): Flow {
        const flow: Flow = new Flow();
        flow.id = rawFlow.id;
        flow.key = rawFlow.key;
        flow.projectId = rawFlow.project;
        flow.name = rawFlow.name;
        flow.description = rawFlow.description;
        flow.isDirect = Utils.isTrue(rawFlow.is_direct);
        flow.state = State.fromString(rawFlow.state);
        flow.parallelLimit = Utils.parseInt(rawFlow.parallel_limit);
        flow.codeSource = rawFlow.code_source;
        flow.metadata = DataValueCollection.fromObject(rawFlow.metadata);
        return flow;
    }
}
