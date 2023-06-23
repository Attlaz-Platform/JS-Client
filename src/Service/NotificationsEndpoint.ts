import {Endpoint} from './Endpoint.js';
import {Notification} from '../Model/Notification.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';

export class NotificationsEndpoint extends Endpoint {

    public async getAll(unacknowledgedOnly: boolean = false): Promise<CollectionResult<Notification>> {

        const result: CollectionResult<Notification> = await this.requestCollection('/notifications?unacknowledgedOnly=' + unacknowledgedOnly, Notification.parse);
        return result;

    }

    public async save(notification: Notification): Promise<Notification> {
        const result: ObjectResult<Notification> = await this.requestObject('/notifications', notification, Notification.parse, 'POST');
        const savedNotification: Notification | null = result.getData();
        if (savedNotification === null) {
            throw new Error('Unable to save notification: wrong response from API');
        }
        return savedNotification;
    }
}
