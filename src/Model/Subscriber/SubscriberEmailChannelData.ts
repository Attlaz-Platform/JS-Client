import {SubscriberChannelData} from "./SubscriberChannelData";


export class SubscriberEmailChannelData extends SubscriberChannelData {
    public email: string;

    public constructor(email: string) {
        super("email");
        this.email = email;
    }
}