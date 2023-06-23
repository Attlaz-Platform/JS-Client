import {ChannelType} from './ChannelType.js';

export abstract class ChannelData {
    public type: ChannelType;

    public constructor(type: ChannelType) {
        this.type = type;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}
