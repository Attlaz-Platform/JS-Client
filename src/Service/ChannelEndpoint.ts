import {Channel, Endpoint} from "..";

export class ChannelEndpoint extends Endpoint {

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

    public async save(subscriberChannel: Channel): Promise<any> {

        try {
            let url: string = '/channels/';

            const result: any = this.httpClient.request(url, subscriberChannel, 'POST');
            return result;
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

            const result: any = this.httpClient.request(url, {}, 'POST');
            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to test channel: ', ex);
            }
            throw ex;
        }

    }
}
