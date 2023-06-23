import {ChannelData} from './ChannelData.js';
import {ChannelType} from './ChannelType.js';

export class PushChannelData extends ChannelData {

    public endpoint: string;
    public keys: any;
    public expirationTime: number | null;
    public browser: string;
    public os: string;

    public constructor(endpoint: string, keys: any) {
        super(ChannelType.Push);
        this.endpoint = endpoint;
        this.keys = keys;
    }
}
