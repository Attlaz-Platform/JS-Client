import {EventType, LogLevel, SubscriberData} from "../../";

export class Subscriber {
    public id: string;
    public eventType: EventType;
    public branch: string;
    public task: string;

    public data: SubscriberData;

    public channel: string;
    public logLevelThreshold: LogLevel;
    public logLevelFilter: LogLevel[];

    constructor(id: string, eventType: EventType, branch: string, task: string, data: SubscriberData, channel: string, logLevelThreshold: LogLevel = null, logLevelFilter: LogLevel[] = null) {
        this.id = id;
        this.eventType = eventType;
        this.branch = branch;
        this.task = task;
        this.data = data;

        this.channel = channel;
        this.logLevelThreshold = logLevelThreshold;
        this.logLevelFilter = logLevelFilter;
    }

    public getLogLevelThreshold(): LogLevel {
        return this.logLevelThreshold;
    }

    public hasLogLevelThreshold(): boolean {
        return this.logLevelThreshold !== null;
    }

    public getLogLevelFilter(): LogLevel[] {
        return this.logLevelFilter;
    }

    public hasLogLevelFilter(): boolean {
        return this.logLevelFilter !== null;
    }

    public getData(): SubscriberData {
        return this.data;
    }
}
