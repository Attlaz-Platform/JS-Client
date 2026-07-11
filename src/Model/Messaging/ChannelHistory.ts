import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class ChannelHistory {
    public id: string;
    public subscriberId: string;
    public channelId: string;
    public time: Date;
    public message: unknown;
    public result: unknown;
    public status: string;

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
    public static parse(rawChannelHistory: ApiRecord): ChannelHistory {
        const log: ChannelHistory = new ChannelHistory();
        log.id = rawChannelHistory.id as string;
        log.subscriberId = rawChannelHistory.subscriber as string;
        log.channelId = rawChannelHistory.channel as string;
        log.time = Utils.parseRawDate(rawChannelHistory.time as Date);
        log.message = rawChannelHistory.message;
        log.result = rawChannelHistory.result;
        log.status = rawChannelHistory.status as string;
        return log;
    }
}
