import {Endpoint} from './Endpoint.js';
import {CollectionResult} from '../Model/Result/CollectionResult.js';
import {ObjectResult} from '../Model/Result/ObjectResult.js';
import {InboxMessage} from '../Model/Inbox/InboxMessage.js';
import {QueryString} from '../Http/Data/QueryString.js';
import {CursorPagination} from '../Model/Pagination/CursorPagination.js';

export class InboxEndpoint extends Endpoint {
    public async getAll(pagination: CursorPagination | null = null, unacknowledgedOnly: boolean = false): Promise<CollectionResult<InboxMessage>> {
        const queryString: QueryString = new QueryString('inbox_messages');
        queryString.set('unacknowledgedOnly', unacknowledgedOnly);
        queryString.addPagination(pagination);

        const result: CollectionResult<InboxMessage> = await this.requestCollection(queryString, InboxMessage.parse);
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
