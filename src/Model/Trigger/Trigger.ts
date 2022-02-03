import {TriggerData} from "./TriggerData";
import {State} from '../State';
import {TriggerType} from './TriggerType';
import {ScheduleTriggerData} from './ScheduleTriggerData';
import {WebhookTriggerData} from './WebhookTriggerData';
import {ApiTriggerData} from './ApiTriggerData';
import {StateAware} from '../StateAware';

export class Trigger implements StateAware{
    public id: string;
    public type: TriggerType;
    public projectEnvironment: string;
    public task: string;
    public arguments: {};
    public data: TriggerData;
    public state: State = State.Active;

    public constructor(id: string, type: TriggerType, projectEnvironment: string, task: string, data: TriggerData) {
        this.id = id;
        this.type = type;
        this.projectEnvironment = projectEnvironment;
        this.task = task;
        this.data = data;

        this.arguments = {};
    }

    public static parse(rawTrigger: any): Trigger {
        const type: TriggerType = TriggerType.fromString(rawTrigger.type);

        const data: any = rawTrigger.data;

        const task: string = rawTrigger.task;

        let triggerData: TriggerData;
        switch (type) {
            case TriggerType.Webhook:
                triggerData = new WebhookTriggerData(data.key);
                break;
            case  TriggerType.Schedule:
                triggerData = new ScheduleTriggerData(data.expression);
                break;
            case  TriggerType.Api:
                triggerData = new ApiTriggerData();
                break;
            default:
                throw new Error('Unknown trigger type "' + type + '"');
        }

        let trigger: Trigger = new Trigger(rawTrigger.id, type, rawTrigger.projectEnvironment, task, triggerData);

        trigger.arguments = rawTrigger.arguments;

        trigger.state = State.fromString(rawTrigger.state);

        return trigger
    }

    public getData(): TriggerData {
        return this.data;
    }
}
