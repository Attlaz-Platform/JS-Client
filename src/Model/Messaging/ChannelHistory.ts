import {Utils} from '../../Utils';

export class ChannelHistory {
    public id: number;
    public subscriber: string;
    public channel: number;
    public time: Date;
    public message: any;
    public success: boolean;
    public result: string;

    // public constructor(id: number, subscriber: string, channel: number, time: Date, message: string = '', success: boolean = true, result: string = '') {
    //     this.id = id;
    //     this.subscriber = subscriber;
    //     this.channel = channel;
    //     this.time = time;
    //     this.message = message;
    //     this.success = success;
    //     this.result = result;
    //
    // }
    public static parse(rawLog: any): ChannelHistory {
        let log: ChannelHistory = new ChannelHistory();
        log.id = rawLog.id;
        log.subscriber = rawLog.subscriber;
        log.channel = rawLog.channel;
        log.time = new Date(rawLog.time);
        log.message = rawLog.message;
        log.success = Utils.isTrue(rawLog.success);
        log.result = rawLog.result;
        return log;
    }
}
