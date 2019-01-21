import {WebhookTriggerData} from './WebhookTriggerData';
import {Trigger} from './Trigger';
import {TriggerType} from './TriggerType';

export class WebhookTrigger extends Trigger {
    constructor(id: string, project: string, task: string, data: WebhookTriggerData) {
        super(id, TriggerType.Webhook, project, task, data);
    }

    public getData(): WebhookTriggerData {
        return super.getData() as WebhookTriggerData;
    }
}
