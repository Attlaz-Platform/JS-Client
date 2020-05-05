import {ChannelData} from './ChannelData';
import {ChannelType} from './ChannelType';

export class SmsChannelData extends ChannelData {

    public phonenumber: string;

    public constructor(phonenumber: string) {
        super(ChannelType.SMS);
        this.phonenumber = phonenumber;
    }
}
