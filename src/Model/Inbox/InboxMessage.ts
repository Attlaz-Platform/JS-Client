import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class InboxMessage {
    public id: string;
    public userId: string;
    public type: string;
    public subject: string;
    public body: string;
    public time: Date;
    public acknowledged: boolean = false;

    public static parse(rawNotification: ApiRecord): InboxMessage {
        const inboxMessage: InboxMessage = new InboxMessage();
        inboxMessage.id = rawNotification.id as string;
        inboxMessage.userId = rawNotification.user as string;
        inboxMessage.type = rawNotification.type as string;
        inboxMessage.subject = rawNotification.subject as string;
        inboxMessage.body = rawNotification.body as string;
        inboxMessage.time = Utils.parseRawDate(rawNotification.time as Date);
        inboxMessage.acknowledged = Utils.isTrue(rawNotification.acknowledged as boolean);
        return inboxMessage;
    }
}
