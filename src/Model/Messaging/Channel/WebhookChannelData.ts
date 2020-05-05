import {ChannelData} from './ChannelData';
import {ChannelType} from './ChannelType';

export class WebhookChannelData extends ChannelData {

    public url: string;
    public method: string;

    public constructor(url: string, method: string = 'GET') {
        super(ChannelType.Webhook);

        this.url = url;
        this.method = method;

    }
}
