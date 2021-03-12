import {ChannelType} from './ChannelType';
import {State} from '../../State';
import {Utils} from '../../../Utils';

export class Channel {
    public id: string;
    public owner: string;
    public label: string;
    public type: ChannelType;
    public data: any;
    public state: State = State.Active;

    public private: boolean = false;

    public constructor(id: string, owner: string, label: string, type: ChannelType, data: any) {
        this.id = id;
        this.owner = owner;
        this.label = label;
        this.type = type;
        this.data = data;
    }

    public static parse(rawChannel: any): Channel {
        const type: ChannelType = ChannelType.fromString(rawChannel.type);
        const channel: Channel = new Channel(rawChannel.id, rawChannel.owner, rawChannel.label, type, rawChannel.data);
        channel.state = State.fromString(rawChannel.state);
        channel.private = Utils.isTrue(rawChannel.private);
        return channel;
    }

}
