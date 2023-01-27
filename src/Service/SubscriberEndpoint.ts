import {Endpoint} from './Endpoint';
import {Subscriber} from '../Model/Messaging/Subscriber';
import {Utils} from '../Utils';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';
import {Parameters} from '../Http/Data/Parameters';

export class SubscriberEndpoint extends Endpoint {

    public async getSubscribersByFlow(flowId: string, projectEnvironmentId: string | null = null): Promise<CollectionResult<Subscriber>> {

        let parameters: Parameters = null;
        if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
            parameters = {environment: projectEnvironmentId};
        }

        const result: CollectionResult<Subscriber> = await this.requestCollection('/flows/' + flowId + '/subscribers', Subscriber.parseRaw, parameters)
        return result;

    }

    public async getSubscribersByChannel(channelId: string): Promise<CollectionResult<Subscriber>> {

        const result: CollectionResult<Subscriber> = await this.requestCollection('/channels/' + channelId + '/subscribers', Subscriber.parseRaw)
        return result;

    }

    public async save(subscriber: Subscriber): Promise<Subscriber> {

        let url: string = '/flows/' + subscriber.flowId + '/subscribers';

        const result: ObjectResult<Subscriber> = await this.requestObject(url, subscriber, Subscriber.parseRaw, 'POST');
        const createdSubscriber: Subscriber | null = result.getData();
        if (createdSubscriber === null) {
            throw new Error('Subscriber not created');
        }
        return createdSubscriber;
    }
}
