import {TriggerData} from './TriggerData.js';

export class WebhookTriggerData extends TriggerData {
    public key: string;

    public constructor(key: string) {
        super();
        this.key = key;
    }
}
