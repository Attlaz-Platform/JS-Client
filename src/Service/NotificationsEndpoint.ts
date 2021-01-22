import {Endpoint, Notification} from '..';

export class NotificationsEndpoint extends Endpoint {

    public getAll(unacknowledgedOnly: boolean = false): Promise<Notification[]> {
        return new Promise<Notification[]>((resolve, reject) => {
            this.httpClient.request('/notifications?unacknowledgedOnly=' + unacknowledgedOnly).then((rawNotifications: any) => {

                let notifications: Notification[] = [];
                for (let rawNotification of rawNotifications) {
//TODO: parse to objects
                    // subscribers.push(rawSubscriber);

                    let notification: Notification = new Notification();
                    notification.id = rawNotification.id;
                    notification.user = rawNotification.user;
                    notification.type = rawNotification.type;
                    notification.subject = rawNotification.subject;
                    notification.body = rawNotification.body;
                    notification.time = rawNotification.time;
                    notification.acknowledged = rawNotification.acknowledged === 1;

                    notifications.push(notification);

                }
                resolve(notifications);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load notifications: ', reason);
                }

                reject(reason);
            });

        });
    }

    public save(notification: Notification): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/notifications';

            this.httpClient.request(url, notification, 'POST').then((result: any) => {

                resolve(result);

            }).catch((reason: any) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save notification: ', reason);
                }
                reject(reason);
            });

        });
    }
}
