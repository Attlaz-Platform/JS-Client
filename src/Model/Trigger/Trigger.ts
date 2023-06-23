import {TriggerData} from './TriggerData';
import {State} from '../State.js';
import {TriggerType} from './TriggerType.js';
import {ScheduleTriggerData} from './ScheduleTriggerData.js';
import {WebhookTriggerData} from './WebhookTriggerData.js';
import {ApiTriggerData} from './ApiTriggerData.js';
import {StateAware} from '../StateAware.js';
import {MetaDataAware} from '../../Core/MetaDataAware.js';
import {DataValueCollection} from '../DataValueCollection.js';

export class Trigger extends MetaDataAware implements StateAware {
    public id: string;
    public type: TriggerType;
    public projectEnvironmentId: string;
    public flowId: string;
    public arguments: {};
    public data: TriggerData;
    public state: State = State.Active;

    public constructor(id: string, type: TriggerType, projectEnvironmentId: string, flowId: string, data: TriggerData) {
        super();
        this.id = id;
        this.type = type;
        this.projectEnvironmentId = projectEnvironmentId;
        this.flowId = flowId;
        this.data = data;

        this.arguments = {};
    }

    public static parse(rawTrigger: any): Trigger {
        const type: TriggerType = TriggerType.fromString(rawTrigger.type);

        const {data} = rawTrigger;

        const flowId: string = rawTrigger.flow;

        let triggerData: TriggerData;
        switch (type) {
            case TriggerType.Webhook:
                triggerData = new WebhookTriggerData(data.key);
                break;
            case TriggerType.Schedule:
                triggerData = new ScheduleTriggerData(data.expression);
                break;
            case TriggerType.Api:
                triggerData = new ApiTriggerData();
                break;
            default:
                throw new Error('Unknown trigger type "' + type + '"');
        }

        const trigger: Trigger = new Trigger(rawTrigger.id, type, rawTrigger.project_environment, flowId, triggerData);

        trigger.arguments = rawTrigger.arguments;
        trigger.state = State.fromString(rawTrigger.state);
        trigger.metadata = DataValueCollection.fromObject(rawTrigger.metadata);

        return trigger;
    }

    public getData(): TriggerData {
        return this.data;
    }
}
