import {EventType, LogLevel, SubscriberChannelData} from "../../";

export class Subscriber {
    public id: string;
    public eventTypes: EventType[];

    public branch: string;
    public task: string;
    public taskExecution: string;

    public channels: SubscriberChannelData[];
    public logLevelThreshold: LogLevel;

    constructor(id: string, eventTypes: EventType[], branch: string, task: string, taskExecution: string, channels: SubscriberChannelData[], logLevelThreshold: LogLevel = null) {
        this.id = id;
        this.eventTypes = eventTypes;
        this.branch = branch;
        this.task = task;
        this.taskExecution = taskExecution;

        this.channels = channels;
        this.logLevelThreshold = logLevelThreshold;

    }

    public getLogLevelThreshold(): LogLevel {
        return this.logLevelThreshold;
    }

    public hasLogLevelThreshold(): boolean {
        return this.logLevelThreshold !== null;
    }

    public getChannels(): SubscriberChannelData[] {
        return this.channels;
    }
}
