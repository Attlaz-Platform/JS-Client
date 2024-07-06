import {ChannelData} from './ChannelData.js';
import {ChannelType} from './ChannelType.js';

export class PushChannelData extends ChannelData {
    public userId: string;

    public constructor(userId: string) {
        super(ChannelType.Push);
        this.userId = userId;
    }
}
