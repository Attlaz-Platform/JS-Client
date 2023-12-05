import {Utils} from '../../Utils';

export class InboxMessage {
    public id: string;
    public userId: string;
    public type: string;
    public subject: string;
    public body: string;
    public time: Date;
    public acknowledged: boolean = false;

    public static parse(rawNotification: any): InboxMessage {
        const inboxMessage: InboxMessage = new InboxMessage();
        inboxMessage.id = rawNotification.id;
        inboxMessage.userId = rawNotification.user;
        inboxMessage.type = rawNotification.type;
        inboxMessage.subject = rawNotification.subject;
        inboxMessage.body = rawNotification.body;
        inboxMessage.time = Utils.parseRawDate(rawNotification.time);
        inboxMessage.acknowledged = rawNotification.acknowledged === 1;
        return inboxMessage;
    }
}
