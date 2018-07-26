import {Endpoint, Subscriber, SubscriberChannelData, SubscriberEmailChannelData, SubscriberSlackChannelData} from "..";

export class SubscriberEndpoint extends Endpoint {

    public getSubscribersByTask(taskId: string): Promise<Subscriber[]> {
        return new Promise<Subscriber[]>((resolve, reject) => {
            this.httpClient.request('/tasks/' + taskId + '/subscribers').then((rawSubscribers: any) => {

                let subscribers: Subscriber[] = [];
                for (let rawSubscriber of rawSubscribers) {
//TODO: parse to objects
                    // subscribers.push(rawSubscriber);

                    let channels: SubscriberChannelData[] = [];

                    for (let rawChannel of rawSubscriber.channels) {
                        switch (rawChannel.type) {
                            case 'email':
                                const emailChannelData: SubscriberEmailChannelData = new SubscriberEmailChannelData(rawChannel.email);
                                channels.push(emailChannelData);
                                break;
                            case 'slack':
                                const slackChannelData: SubscriberSlackChannelData = new SubscriberSlackChannelData(rawChannel.webhook, rawChannel.channel);
                                channels.push(slackChannelData);
                                break;
                            default:
                                throw new Error('Unable to parse subscriber "' + rawSubscriber.id + '" to object: unknown subscriber channel "' + rawChannel.type + '"');
                        }
                    }

                    let subscriber: Subscriber = new Subscriber(rawSubscriber.id, rawSubscriber.eventTypes, rawSubscriber.branch, rawSubscriber.task, rawSubscriber.task_execution, channels, rawSubscriber.logLevelThreshold);

                    subscribers.push(subscriber);

                }
                resolve(subscribers);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load subscribers: ', reason);
                }

                reject(reason);
            });

        });
    }

    public save(subscriber: Subscriber): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/tasks/' + subscriber.task + '/subscribers';

            this.httpClient.request(url, subscriber, 'POST').then((result: any) => {

                resolve(result);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save subscriber: ', reason);
                }
                reject(reason);
            });

        });
    }
}