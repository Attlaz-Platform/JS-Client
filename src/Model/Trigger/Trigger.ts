import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {DataValueCollection} from '../DataValueCollection.js';

export class Trigger extends MetaDataAware implements StateAware {
    public id: string;
    public type: string;
    public projectEnvironmentId: string;
    public flowId: string;
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

    public static parse(rawTrigger: any): Trigger {
        const flowId: string = rawTrigger.flow;

        const parsedData: DataValueCollection = DataValueCollection.fromObject(rawTrigger.data);

        const trigger: Trigger = new Trigger(rawTrigger.id, rawTrigger.type, rawTrigger.project_environment, flowId, parsedData);

        trigger.arguments = rawTrigger.arguments;
        trigger.state = State.fromString(rawTrigger.state);
        trigger.metadata = DataValueCollection.fromObject(rawTrigger.metadata);

        return trigger;
    }

    public getData(): DataValueCollection {
        return this.data;
    }
}
