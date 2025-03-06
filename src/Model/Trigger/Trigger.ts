import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {DataValueCollection} from '../DataValueCollection.js';
import {ApiRecord} from '../ApiRecord.js';

export class Trigger extends MetaDataAware implements StateAware {
    public id: string;
    public type: string;
    public projectEnvironmentId: string;
    public flowId: string;
    public target: string;
    public arguments: {};
    public data: DataValueCollection;
    public state: State = State.Active;

    public constructor(id: string, type: string, projectEnvironmentId: string, flowId: string, data: DataValueCollection) {
        super();
        this.id = id;
        this.type = type;
        this.projectEnvironmentId = projectEnvironmentId;
        this.flowId = flowId;
        this.data = data;

        this.arguments = {};
    }

    public static parse(rawTrigger: ApiRecord): Trigger {
        const flowId: string = rawTrigger.flow as string;

        const parsedData: DataValueCollection = DataValueCollection.fromObject(rawTrigger.data as any);

        const trigger: Trigger = new Trigger(rawTrigger.id as string, rawTrigger.type as string, rawTrigger.project_environment as string, flowId, parsedData);
        trigger.target = rawTrigger.target as string;
        trigger.arguments = rawTrigger.arguments as any
        trigger.state = State.fromString(rawTrigger.state as string);


        return trigger;
    }

    public getData(): DataValueCollection {
        return this.data;
    }
}
