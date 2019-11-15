export class SubscriberHistory {
    public id: number;
    public subscriber: string;
    public channel: number;
    public time: Date;
    public message: any;
    public success: boolean;
    public result: string;

    public constructor(id: number, subscriber: string, channel: number, time: Date, message: string = '', success: boolean = true, result: string = '') {
        this.id = id;
        this.subscriber = subscriber;
        this.channel = channel;
        this.time = time;
        this.message = message;
        this.success = success;
        this.result = result;

    }

}
