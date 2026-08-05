import {path} from '../Http/Data/Path.js';
import {Subscriber} from '../Model/Messaging/Subscriber.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {Endpoint} from './Endpoint.js';

export class SubscriberEndpoint extends Endpoint {
    public async getSubscribersByFlow(flowId: string, projectEnvironmentId: string | null = null, pagination: CursorPagination | null = null): Promise<CollectionResult<Subscriber>> {
        const qu: QueryString = new QueryString(path('/flows/:flowId/subscribers', {flowId}));
        if (projectEnvironmentId !== null && projectEnvironmentId !== undefined) {
            qu.set('environment', projectEnvironmentId);
        }
        qu.addPagination(pagination);

        const result: CollectionResult<Subscriber> = await this.requestCollection(qu, Subscriber.parseRaw);
        return result;
    }

    public async getSubscribersByChannel(channelId: string, pagination: CursorPagination | null = null): Promise<CollectionResult<Subscriber>> {

        const qu: QueryString = new QueryString(path('/channels/:channelId/subscribers', {channelId}));
        qu.addPagination(pagination);

        const result: CollectionResult<Subscriber> = await this.requestCollection(qu, Subscriber.parseRaw);
        return result;
    }

    public async save(subscriber: Subscriber): Promise<Subscriber> {
        const url: string = path('/flows/:flowId/subscribers', {flowId: subscriber.flowId});

        const result: ObjectResult<Subscriber> = await this.requestObject(url, subscriber, Subscriber.parseRaw, 'POST');
        const createdSubscriber: Subscriber | null = result.getData();
        if (createdSubscriber === null) {
            throw new Error('Subscriber not created');
        }
        return createdSubscriber;
    }
}
