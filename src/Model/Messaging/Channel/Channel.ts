import {State} from '../../State.js';
import {Utils} from '../../../Utils.js';
import {StateAware} from '../../StateAware.js';
import {MetaDataAware} from '../../../Core/MetaDataAware.js';
import {ChannelType} from './ChannelType.js';

export class Channel extends MetaDataAware implements StateAware {
    public id: string;
    public ownerId: string;
    public type: ChannelType;
    public data: any;
    public state: State = State.Active;
    public workspaces: string[] = [];
    public isPrivate: boolean = false;
    public singleUse: boolean = false;

    public constructor(id: string, ownerId: string, name: string, type: ChannelType, data: any) {
        super();
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.type = type;
        this.data = data;
    }

    public static parse(rawChannel: Record<string, unknown>): Channel {
        const type: ChannelType = ChannelType.fromString(rawChannel.type as string);
        const channel: Channel = new Channel(rawChannel.id as string, rawChannel.owner as string, rawChannel.name as string, type, rawChannel.data);
        channel.state = State.fromString(rawChannel.state as string);
        channel.isPrivate = Utils.isTrue(rawChannel.is_private as boolean);
        channel.singleUse = Utils.isTrue(rawChannel.single_use as boolean);
        channel.workspaces = rawChannel.workspaces as any;

        return channel;
    }
}
