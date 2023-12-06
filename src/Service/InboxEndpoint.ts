import {Endpoint} from './Endpoint.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {InboxMessage} from '../Model/Inbox/InboxMessage.js';

export class InboxEndpoint extends Endpoint {
    public async getAll(unacknowledgedOnly: boolean = false): Promise<CollectionResult<InboxMessage>> {
        const result: CollectionResult<InboxMessage> = await this.requestCollection('/inbox_messages?unacknowledgedOnly=' + unacknowledgedOnly, InboxMessage.parse);
        return result;
    }

    public async save(message: InboxMessage): Promise<InboxMessage> {
        const result: ObjectResult<InboxMessage> = await this.requestObject('/inbox_messages', message, InboxMessage.parse, 'POST');
        const savedNotification: InboxMessage | null = result.getData();
        if (savedNotification === null) {
            throw new Error('Unable to save inbox message: wrong response from API');
        }
        return savedNotification;
    }
}
