import {Endpoint, Subscriber, Utils} from '..';

export class SubscriberEndpoint extends Endpoint {

    public getSubscribersByTask(taskId: string, projectEnvironmentId: string = null): Promise<Subscriber[]> {
        return new Promise<Subscriber[]>((resolve, reject) => {

            let parameters: any = null;
            if (!Utils.isNullOrUndefined(projectEnvironmentId)) {
                parameters = {environment: projectEnvironmentId};
            }

            this.httpClient.request('/tasks/' + taskId + '/subscribers', parameters).then((rawSubscribers: any) => {

                let subscribers: Subscriber[] = [];
                for (let rawSubscriber of rawSubscribers) {
                    subscribers.push(Subscriber.parseRaw(rawSubscriber));
                }
                resolve(subscribers);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load subscribers: ', reason);
                }

                reject(reason);
            });

        });
    }

    public getSubscribersByChannel(channelId: string): Promise<Subscriber[]> {
        return new Promise<Subscriber[]>((resolve, reject) => {

            this.httpClient.request('/channels/' + channelId + '/subscribers').then((rawSubscribers: any) => {

                let subscribers: Subscriber[] = [];
                for (let rawSubscriber of rawSubscribers) {
                    subscribers.push(Subscriber.parseRaw(rawSubscriber));
                }
                resolve(subscribers);

            }).catch((reason: any) => {
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

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save subscriber: ', reason);
                }
                reject(reason);
            });

        });
    }
}
