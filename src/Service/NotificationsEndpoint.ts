import {Endpoint} from './Endpoint';
import {Notification} from '../Model/Notification';
import {CollectionResult} from '../Model/Result/CollectionResult';
import {ObjectResult} from '../Model/Result/ObjectResult';

export class NotificationsEndpoint extends Endpoint {

    public async getAll(unacknowledgedOnly: boolean = false): Promise<CollectionResult<Notification>> {

        const parser = (rawNotification: any): Notification => {
            let notification: Notification = new Notification();
            notification.id = rawNotification.id;
            notification.userId = rawNotification.user;
            notification.type = rawNotification.type;
            notification.subject = rawNotification.subject;
            notification.body = rawNotification.body;
            notification.time = rawNotification.time;
            notification.acknowledged = rawNotification.acknowledged === 1;
            return notification;
        }
        const result: CollectionResult<Notification> = await this.requestCollection('/notifications?unacknowledgedOnly=' + unacknowledgedOnly, null, parser);
        return result;

    }

    public async save(notification: Notification): Promise<Notification> {

        const parser = (raw: any): any => {
            return raw;
        }
        const result: ObjectResult<Notification> = await this.requestObject('/notifications', notification, parser, 'POST');
        const savedNotification: Notification | null = result.getData();
        if (savedNotification === null) {
            throw new Error('Unable to save notification: wrong response from API');
        }
        return savedNotification;
    }
}
