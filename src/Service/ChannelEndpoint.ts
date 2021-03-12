import {Endpoint} from './Endpoint';
import {Channel, ChannelHistory, DataResult, Utils} from '..';

export class ChannelEndpoint extends Endpoint {

    public async getById(channelId: string): Promise<DataResult<Channel>> {

        try {
            const result: DataResult<Channel> = await this.request('/channels/' + channelId + '');

            if (Utils.isNullOrUndefined(result)) {
                return null;
            }

            result.setData(Channel.parse(result.getData()));
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels by id "' + channelId + '": ', ex);
            }

            throw ex;
        }

    }

    public async getByTeam(teamId: string): Promise<Channel[]> {

        try {
            const rawChannels: any = await this.httpClient.request('/teams/' + teamId + '/channels');

            let subscriberChannels: Channel[] = [];
            for (let rawChannel of rawChannels) {
                subscriberChannels.push(Channel.parse(rawChannel));
            }
            return subscriberChannels;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels for team "' + teamId + '": ', ex);
            }

            throw ex;
        }

    }

    public async getByOwner(): Promise<Channel[]> {

        try {
            const rawChannels: any = await this.httpClient.request('/channels');

            let subscriberChannels: Channel[] = [];
            for (let rawChannel of rawChannels) {
                subscriberChannels.push(Channel.parse(rawChannel));
            }
            return subscriberChannels;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels for current user: ', ex);
            }

            throw ex;
        }

    }

    public async getMessages(channelId: string): Promise<DataResult<ChannelHistory[]>> {

        try {
            const rawChannelHistory: DataResult<any[]> = await this.request('/channels/' + channelId + '/messages');

            const data: ChannelHistory[] = [];

            const orig: ChannelHistory[] = rawChannelHistory.getData();

            for (const rawChannelMessage of orig) {
                data.push(ChannelHistory.parse(rawChannelMessage));
            }

            rawChannelHistory.setData(data);

            return rawChannelHistory;
            // let subscriberChannels: Channel[] = [];
            // for (let rawChannel of rawChannels) {
            //     subscriberChannels.push(Channel.parse(rawChannel));
            // }
            // return subscriberChannels;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels history: ', ex);
            }

            throw ex;
        }

    }

    public async save(subscriberChannel: Channel): Promise<Channel> {

        try {
            let url: string = '/channels/';

            const rawResult: any = await this.httpClient.request(url, subscriberChannel, 'POST');

            return Channel.parse(rawResult);
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save channel: ', ex);
            }
            throw ex;
        }

    }

    public async test(subscriberChannel: Channel): Promise<any> {

        try {
            let url: string = '/channels/' + subscriberChannel.id + '/test';

            const result: any = await this.httpClient.request(url, {}, 'POST');
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to test channel: ', ex);
            }
            throw ex;
        }

    }
}
