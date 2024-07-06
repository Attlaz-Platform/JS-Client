import {Endpoint} from './Endpoint.js';
import {Channel} from '../Model/Messaging/Channel/Channel.js';
import {ChannelHistory} from '../Model/Messaging/ChannelHistory.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';

export class ChannelEndpoint extends Endpoint {
    public async getById(channelId: string): Promise<Channel | null> {
        try {
            const result: ObjectResult<Channel> = await this.requestObject('/channels/' + channelId + '', null, Channel.parse);
            return result.getData();
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels by id "' + channelId + '": ', ex);
            }

            throw ex;
        }
    }

    public async getByWorkspace(workspaceId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<Channel>> {
        try {
            const queryString: QueryString = new QueryString('/workspaces/' + workspaceId + '/channels');
            queryString.addPagination(pagination);
            const result: CollectionResult<Channel> = await this.requestCollection(queryString, Channel.parse);

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels for workspace "' + workspaceId + '": ', ex);
            }

            throw ex;
        }
    }

    public async getByOwner(pagination: CursorPagination | null = null): Promise<CollectionResult<Channel>> {
        try {
            const queryString: QueryString = new QueryString('channels');
            queryString.addPagination(pagination);
            const result: CollectionResult<Channel> = await this.requestCollection(queryString, Channel.parse);

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels for current user: ', ex);
            }

            throw ex;
        }
    }

    public async getMessages(channelId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<ChannelHistory>> {
        try {
            const querystring: QueryString = new QueryString('/channels/' + channelId + '/messages');
            querystring.addPagination(pagination);
            const result: CollectionResult<ChannelHistory> = await this.requestCollection(querystring, ChannelHistory.parse);

            return result;
        } catch (ex) {
            if (this.httpClient.isDebugEnabled()) {
                console.error('Failed to load channels history: ', ex);
            }

            throw ex;
        }
    }

    public async save(subscriberChannel: Channel): Promise<Channel> {
        try {
            const url: string = '/channels/';

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
            const url: string = '/channels/' + subscriberChannel.id + '/test';

            const parser = (raw: any): { tested: boolean } => ({tested: raw.tested});
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
