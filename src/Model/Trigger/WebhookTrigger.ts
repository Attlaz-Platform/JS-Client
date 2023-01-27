import {WebhookTriggerData} from './WebhookTriggerData';
import {Trigger} from './Trigger';
import {TriggerType} from './TriggerType';

export class WebhookTrigger extends Trigger {
    constructor(id: string, projectEnvironmentId: string, flowId: string, data: WebhookTriggerData) {
        super(id, TriggerType.Webhook, projectEnvironmentId, flowId, data);
    }

    public getData(): WebhookTriggerData {
        return super.getData() as WebhookTriggerData;
    }
}
