import {WebhookTriggerData} from './WebhookTriggerData.js';
import {Trigger} from './Trigger.js';
import {TriggerType} from './TriggerType.js';

export class WebhookTrigger extends Trigger {
    constructor(id: string, projectEnvironmentId: string, flowId: string, data: WebhookTriggerData) {
        super(id, TriggerType.Webhook, projectEnvironmentId, flowId, data);
    }

    public getData(): WebhookTriggerData {
        return super.getData() as WebhookTriggerData;
    }
}
