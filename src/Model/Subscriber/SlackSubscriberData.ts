import {SubscriberData} from "./SubscriberData";

export class SlackSubscriberData extends SubscriberData {
    public webhook: string;
    public channel: string;

    public constructor(webhook: string, channel: string) {
        super();
        this.webhook = webhook;
        this.channel = channel;
    }
}