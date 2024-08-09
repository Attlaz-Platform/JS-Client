import {EntityId} from '../EntityId.js';

export class LogStreamId extends EntityId {
    protected readonly TYPE: string = 'logStreamId';

    public jsonSerialize(): string {
        return this.id;
    }
}
