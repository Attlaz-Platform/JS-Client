import {EmailSubscriberData, EventType, LogLevel, Subscriber} from "../../";

export class EmailSubscriber extends Subscriber {
    constructor(id: string, eventType: EventType, branch: string, task: string, data: EmailSubscriberData, logLevelThreshold: LogLevel = null, logLevelFilter: LogLevel[] = null) {
        super(id, eventType, branch, task, data, 'email', logLevelThreshold, logLevelFilter);
    }

    public getData(): EmailSubscriberData {
        return <EmailSubscriberData>super.getData();
    }
}