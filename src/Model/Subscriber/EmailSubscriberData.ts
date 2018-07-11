import {SubscriberData} from "./SubscriberData";

export class EmailSubscriberData extends SubscriberData {
    public email: string;

    public constructor(email: string) {
        super();
        this.email = email;
    }
}