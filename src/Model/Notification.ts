import {Utils} from '../Utils.js';

export class Notification {
    public id: number;
    public userId: number;
    public type: string;
    public subject: string;
    public body: string;
    public time: Date;
    public acknowledged: boolean = false;

    public static parse(rawNotification: any): Notification {
        let notification: Notification = new Notification();
        notification.id = rawNotification.id;
        notification.userId = rawNotification.user;
        notification.type = rawNotification.type;
        notification.subject = rawNotification.subject;
        notification.body = rawNotification.body;
        notification.time = Utils.parseRawDate(rawNotification.time);
        notification.acknowledged = rawNotification.acknowledged === 1;
        return notification;

    }
}
