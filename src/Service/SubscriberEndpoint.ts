import {Endpoint,Subscriber as ReportSubscriber} from "..";

export class SubscriberEndpoint extends Endpoint {

    public getSubscribersByTask(taskId: string): Promise<ReportSubscriber[]> {
        return new Promise<ReportSubscriber[]>((resolve, reject) => {
            this.httpClient.request('/branch/' + this.httpClient.getBranchId() + '/task/' + taskId + '/subscriber').then((rawSubscribers: any) => {

                let subscribers: ReportSubscriber[] = [];
                for (let rawSubscriber of rawSubscribers) {

                    subscribers.push(rawSubscriber);
                }
                resolve(subscribers);

            }).catch((reason) => {
                console.log('Failed to load subscribers: ', reason);
                reject(reason);
            });

        });
    }
}