import {SubscriberChannelData} from './SubscriberChannelData';

export class SubscriberSlackChannelData extends SubscriberChannelData {
    public webhook: string;
    public channel: string;

    public constructor(webhook: string, channel: string) {
        super("slack");
        this.webhook = webhook;
        this.channel = channel;
    }
}