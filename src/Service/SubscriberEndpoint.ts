import {Endpoint} from './Endpoint';
import {Subscriber} from '../Model/Messaging/Subscriber';
import {Utils} from '../Utils';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class SubscriberEndpoint extends Endpoint {

    public async getSubscribersByTask(taskId: string, projectEnvironmentId: string | null = null): Promise<CollectionResult<Subscriber>> {

        let parameters: any = null;
        if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
            parameters = {environment: projectEnvironmentId};
        }

        const result: CollectionResult<Subscriber> = await this.requestCollection('/tasks/' + taskId + '/subscribers', parameters, Subscriber.parseRaw)
        return result;

    }

    public async getSubscribersByChannel(channelId: string): Promise<CollectionResult<Subscriber>> {

        const result: CollectionResult<Subscriber> = await this.requestCollection('/channels/' + channelId + '/subscribers', null, Subscriber.parseRaw)
        return result;

    }

    public async save(subscriber: Subscriber): Promise<Subscriber> {

        let url: string = '/tasks/' + subscriber.task + '/subscribers';

        const result: ObjectResult<Subscriber> = await this.requestObject(url, subscriber, Subscriber.parseRaw, 'POST');
        const createdSubscriber: Subscriber | null = result.getData();
        if (createdSubscriber === null) {
            throw new Error('Subscriber not created');
        }
        return createdSubscriber;
    }
}
