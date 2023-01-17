import {Endpoint} from './Endpoint';
import {Channel} from '../Model/Messaging/Channel/Channel';
import {ChannelHistory} from '../Model/Messaging/ChannelHistory';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {CollectionResult} from '../Model/Result/CollectionResult';

export class ChannelEndpoint extends Endpoint {

    public async getById(channelId: string): Promise<Channel | null> {

        try {
            const result: ObjectResult<Channel> = await this.requestObject('/channels/' + channelId + '', null, Channel.parse);

            // if (Utils.isNullOrUndefined(result)) {
            //
            // } else {
            //     result.setData(Channel.parse(result.getData()));
            // }
            return result.getData();
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels by id "' + channelId + '": ', ex);
            }

            throw ex;
        }

    }

    public async getByWorkspace(workspaceId: string): Promise<CollectionResult<Channel>> {

        try {
            const result: CollectionResult<Channel> = await this.requestCollection('/workspaces/' + workspaceId + '/channels', null, Channel.parse);

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels for workspace "' + workspaceId + '": ', ex);
            }

            throw ex;
        }

    }

    public async getByOwner(): Promise<CollectionResult<Channel>> {

        try {
            const result: CollectionResult<Channel> = await this.requestCollection('/channels', null, Channel.parse);

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels for current user: ', ex);
            }

            throw ex;
        }

    }

    public async getMessages(channelId: string): Promise<CollectionResult<ChannelHistory>> {

        try {
            const result: CollectionResult<ChannelHistory> = await this.requestCollection('/channels/' + channelId + '/messages', null, ChannelHistory.parse);

            return result;
            // const data: ChannelHistory[] = [];
            //
            // const resultData: any | null = rawChannelHistory.getData();
            // if (resultData !== null) {
            //     const orig: ChannelHistory[] = resultData;
            //
            //     for (const rawChannelMessage of orig) {
            //         data.push(ChannelHistory.parse(rawChannelMessage));
            //     }
            // }
            //
            // rawChannelHistory.setData(data);
            //
            // return rawChannelHistory;
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

            const result: ObjectResult<Channel> = await this.requestObject(url, subscriberChannel, Channel.parse, 'POST');

            const updatedChannel: Channel | null = result.getData();
            if (updatedChannel === null) {
                throw new Error('Unable to update channel: wrong response from API');
            }
            return updatedChannel;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to save channel: ', ex);
            }
            throw ex;
        }

    }

    public async testChannel(subscriberChannel: Channel): Promise<boolean> {

        try {
            let url: string = '/channels/' + subscriberChannel.id + '/test';

            const parser = (raw: any): { tested: boolean } => {
                return {tested: raw.tested};
            }
            const result: ObjectResult<{ tested: boolean }> = await this.requestObject(url, {}, parser, 'POST');

            const re: { tested: boolean } | null = result.getData();
            if (re === null) {
                console.log('testChannel wrong data', {result, parsed: re});
                throw new Error('Unable to test channel: wrong response from API');
            }
            return re.tested;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to test channel: ', ex);
            }
            throw ex;
        }

    }
}
