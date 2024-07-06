import {ChannelType} from './ChannelType.js';
import {State} from '../../State.js';
import {Utils} from '../../../Utils.js';
import {StateAware} from '../../StateAware.js';
import {MetaDataAware} from '../../../Core/MetaDataAware.js';
import {DataValueCollection} from '../../DataValueCollection.js';

export class Channel extends MetaDataAware implements StateAware {
    public id: string;
    public ownerId: string;
    public label: string;
    public type: ChannelType;
    public data: any;
    public state: State = State.Active;
    public workspaces: string[] = [];
    public isPrivate: boolean = false;
    public singleUse: boolean = false;

    public constructor(id: string, ownerId: string, label: string, type: ChannelType, data: any) {
        super();
        this.id = id;
        this.ownerId = ownerId;
        this.label = label;
        this.type = type;
        this.data = data;
    }

    public static parse(rawChannel: any): Channel {
        const type: ChannelType = ChannelType.fromString(rawChannel.type);
        const channel: Channel = new Channel(rawChannel.id, rawChannel.owner, rawChannel.label, type, rawChannel.data);
        channel.state = State.fromString(rawChannel.state);
        channel.isPrivate = Utils.isTrue(rawChannel.is_private);
        channel.singleUse = Utils.isTrue(rawChannel.single_use);
        channel.workspaces = rawChannel.workspaces;
        if (Object.prototype.hasOwnProperty.call(rawChannel, 'metadata')) {
            channel.metadata = DataValueCollection.fromObject(rawChannel.metadata);
        }
        return channel;
    }
}
