import {ChannelData} from './ChannelData.js';
import {ChannelType} from './ChannelType.js';

export class SlackChannelData extends ChannelData {
    public access_token: string;

    public webhook: string;

    public channel_id: string;
    public channel_name: string;

    public team_id: string;
    public team_name: string;

    public constructor(accessToken: string, webhook: string, channelId: string, channelName: string, teamId: string, teamName: string) {
        super(ChannelType.Slack);

        this.access_token = accessToken;

        this.webhook = webhook;

        this.channel_id = channelId;
        this.channel_name = channelName;

        this.team_id = teamId;
        this.team_name = teamName;
    }
}
