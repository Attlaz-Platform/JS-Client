import {Utils} from '../../Utils.js';

export class ChannelHistory {
    public id: number;
    public subscriberId: string;
    public channelId: number;
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
    public static parse(rawChannelHistory: any): ChannelHistory {
        const log: ChannelHistory = new ChannelHistory();
        log.id = rawChannelHistory.id;
        log.subscriberId = rawChannelHistory.subscriber;
        log.channelId = rawChannelHistory.channel;
        log.time = Utils.parseRawDate(rawChannelHistory.time);
        log.message = rawChannelHistory.message;
        log.success = Utils.isTrue(rawChannelHistory.success);
        log.result = rawChannelHistory.result;
        return log;
    }
}
