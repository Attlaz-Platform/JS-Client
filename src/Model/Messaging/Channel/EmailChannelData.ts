import {ChannelData} from "./ChannelData";


export class EmailChannelData extends ChannelData {
    public email: string;

    public constructor(email: string) {
        super("email");
        this.email = email;
    }
}
