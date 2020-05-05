import {ChannelData} from "./ChannelData";
import {ChannelType} from './ChannelType';

export class EmailChannelData extends ChannelData {
    public email: string;

    public constructor(email: string) {
        super(ChannelType.Email);

        this.email = email;
    }
}
