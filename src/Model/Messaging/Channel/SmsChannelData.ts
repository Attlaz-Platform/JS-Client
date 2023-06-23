import {ChannelData} from './ChannelData.js';
import {ChannelType} from './ChannelType.js';

export class SmsChannelData extends ChannelData {

    public phonenumber: string;

    public constructor(phonenumber: string) {
        super(ChannelType.SMS);
        this.phonenumber = phonenumber;
    }
}
