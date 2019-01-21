import {TriggerData} from './TriggerData';

export class WebhookTriggerData extends TriggerData {
    public key: string;

    public constructor(key: string) {
        super();
        this.key = key;
    }
}
