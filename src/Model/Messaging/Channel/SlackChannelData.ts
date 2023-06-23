import {ChannelData} from './ChannelData.js';
import {ChannelType} from './ChannelType.js';

export class SlackChannelData extends ChannelData {
    public access_token: string;

    public webhook: string;

    public channel_id: string;
    public channel_name: string;

    public team_id: string;
    public team_name: string;

    public constructor(access_token: string, webhook: string, channel_id: string, channel_name: string, team_id: string, team_name: string) {
        super(ChannelType.Slack);

        this.access_token = access_token;

        this.webhook = webhook;

        this.channel_id = channel_id;
        this.channel_name = channel_name;

        this.team_id = team_id;
        this.team_name = team_name;
    }
}
